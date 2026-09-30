package com.mams.military_asset_management.service;

import com.mams.military_asset_management.dto.DashboardResponse;
import com.mams.military_asset_management.dto.MovementDetailsResponse;
import com.mams.military_asset_management.entity.Base;
import com.mams.military_asset_management.entity.EquipmentType;
import com.mams.military_asset_management.entity.Expenditure;
import com.mams.military_asset_management.entity.Purchase;
import com.mams.military_asset_management.entity.Role;
import com.mams.military_asset_management.entity.Transfer;
import com.mams.military_asset_management.entity.User;
import com.mams.military_asset_management.repository.BaseRepository;
import com.mams.military_asset_management.repository.EquipmentTypeRepository;
import com.mams.military_asset_management.repository.ExpenditureRepository;
import com.mams.military_asset_management.repository.InventoryRepository;
import com.mams.military_asset_management.repository.PurchaseRepository;
import com.mams.military_asset_management.repository.TransferRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DashboardService {

        private final BaseRepository baseRepository;
        private final EquipmentTypeRepository equipmentTypeRepository;
        private final InventoryRepository inventoryRepository;
        private final PurchaseRepository purchaseRepository;
        private final TransferRepository transferRepository;
        private final ExpenditureRepository expenditureRepository;
        private final CurrentUserService currentUserService;

        public DashboardService(
                        BaseRepository baseRepository,
                        EquipmentTypeRepository equipmentTypeRepository,
                        InventoryRepository inventoryRepository,
                        PurchaseRepository purchaseRepository,
                        TransferRepository transferRepository,
                        ExpenditureRepository expenditureRepository,
                        CurrentUserService currentUserService) {
                this.baseRepository = baseRepository;
                this.equipmentTypeRepository = equipmentTypeRepository;
                this.inventoryRepository = inventoryRepository;
                this.purchaseRepository = purchaseRepository;
                this.transferRepository = transferRepository;
                this.expenditureRepository = expenditureRepository;
                this.currentUserService = currentUserService;
        }

        public DashboardResponse getDashboard(
                        Long baseId,
                        Long equipmentTypeId,
                        LocalDate startDate,
                        LocalDate endDate) {

                User user = currentUserService.getCurrentUser();

                // Default dates
                if (endDate == null) {
                        endDate = LocalDate.now();
                }

                if (startDate == null) {
                        startDate = endDate;
                }

                if (startDate.isAfter(endDate)) {
                        throw new IllegalArgumentException(
                                        "Start date cannot be after end date");
                }

                /*
                 * Determine selected base.
                 *
                 * ADMIN / LOGISTICS:
                 * baseId can be null -> all bases
                 *
                 * BASE_COMMANDER:
                 * always restricted to assigned base
                 */
                Base base = null;

                if (baseId != null) {

                        base = baseRepository.findById(baseId)
                                        .orElseThrow(() -> new IllegalArgumentException(
                                                        "Base not found"));

                } else if (user.getRole() == Role.BASE_COMMANDER) {

                        if (user.getBase() == null) {
                                throw new AccessDeniedException(
                                                "Base commander is not assigned to a base");
                        }

                        base = user.getBase();
                }

                /*
                 * Base commander cannot access another base.
                 */
                if (user.getRole() == Role.BASE_COMMANDER) {

                        if (user.getBase() == null) {
                                throw new AccessDeniedException(
                                                "Base commander is not assigned to a base");
                        }

                        if (base == null ||
                                        !base.getId().equals(user.getBase().getId())) {

                                throw new AccessDeniedException(
                                                "You are not authorized to access this base");
                        }
                }

                /*
                 * Determine equipment type.
                 */
                EquipmentType equipmentType;

                if (equipmentTypeId != null) {

                        equipmentType = equipmentTypeRepository.findById(equipmentTypeId)
                                        .orElseThrow(() -> new IllegalArgumentException(
                                                        "Equipment type not found"));
                } else {
                        equipmentType = null;
                }

                /*
                 * ============================================================
                 * CURRENT INVENTORY
                 * ============================================================
                 *
                 * quantity = physical stock
                 * assignedQuantity = currently assigned stock
                 *
                 * If base == null:
                 * calculate across all bases.
                 *
                 * If equipmentType == null:
                 * calculate across all equipment types.
                 */
                int currentBalance = 0;
                int assigned = 0;

                var inventories = inventoryRepository.findAll();

                for (var inventory : inventories) {

                        // Base filter
                        if (base != null &&
                                        !inventory.getBase()
                                                        .getId()
                                                        .equals(base.getId())) {

                                continue;
                        }

                        // Equipment type filter
                        if (equipmentType != null &&
                                        !inventory.getEquipmentType()
                                                        .getId()
                                                        .equals(equipmentType.getId())) {

                                continue;
                        }

                        currentBalance += inventory.getQuantity();
                        assigned += inventory.getAssignedQuantity();
                }

                /*
                 * ============================================================
                 * PURCHASES
                 * ============================================================
                 */
                List<Purchase> purchases;

                if (base != null && equipmentType != null) {

                        purchases = purchaseRepository
                                        .findByBaseAndEquipmentTypeAndPurchaseDateBetween(
                                                        base,
                                                        equipmentType,
                                                        startDate,
                                                        endDate);

                } else if (base != null) {

                        purchases = purchaseRepository
                                        .findByBaseAndPurchaseDateBetween(
                                                        base,
                                                        startDate,
                                                        endDate);

                } else {

                        purchases = purchaseRepository
                                        .findByPurchaseDateBetween(
                                                        startDate,
                                                        endDate);
                }

                int purchaseQuantity = purchases.stream()
                                .filter(p -> equipmentType == null ||
                                                p.getEquipmentType()
                                                                .getId()
                                                                .equals(equipmentType.getId()))
                                .mapToInt(Purchase::getQuantity)
                                .sum();

                /*
                 * ============================================================
                 * TRANSFERS
                 * ============================================================
                 */
                List<Transfer> transfers = transferRepository
                                .findByTransferDateBetween(
                                                startDate,
                                                endDate);

                int transferIn = 0;
                int transferOut = 0;

                for (Transfer transfer : transfers) {

                        /*
                         * Equipment filter
                         */
                        if (equipmentType != null &&
                                        !transfer.getEquipmentType()
                                                        .getId()
                                                        .equals(equipmentType.getId())) {

                                continue;
                        }

                        /*
                         * All-base dashboard.
                         *
                         * Every internal transfer creates:
                         * Transfer Out = quantity
                         * Transfer In = quantity
                         *
                         * Therefore organization-wide net transfer movement = 0.
                         */
                        if (base == null) {

                                transferIn += transfer.getQuantity();
                                transferOut += transfer.getQuantity();

                                continue;
                        }

                        /*
                         * Selected base dashboard.
                         */
                        if (transfer.getToBase()
                                        .getId()
                                        .equals(base.getId())) {

                                transferIn += transfer.getQuantity();
                        }

                        if (transfer.getFromBase()
                                        .getId()
                                        .equals(base.getId())) {

                                transferOut += transfer.getQuantity();
                        }
                }

                /*
                 * ============================================================
                 * EXPENDITURES
                 * ============================================================
                 */

                List<Expenditure> expenditures;

                if (base != null) {

                        expenditures = expenditureRepository
                                        .findByBaseAndExpenditureDateBetween(
                                                        base,
                                                        startDate,
                                                        endDate);

                } else {

                        LocalDate selectedStartDate = startDate;
                        LocalDate selectedEndDate = endDate;

                        expenditures = expenditureRepository
                                        .findAll()
                                        .stream()
                                        .filter(e -> !e.getExpenditureDate()
                                                        .isBefore(selectedStartDate)
                                                        &&
                                                        !e.getExpenditureDate()
                                                                        .isAfter(selectedEndDate))
                                        .toList();
                }

                int expenditureQuantity = expenditures.stream()
                                .filter(e -> equipmentType == null ||
                                                e.getEquipmentType()
                                                                .getId()
                                                                .equals(equipmentType.getId()))
                                .mapToInt(Expenditure::getQuantity)
                                .sum();

                /*
                 * ============================================================
                 * NET MOVEMENT
                 * ============================================================
                 *
                 * Net Movement =
                 * Purchases
                 * + Transfer In
                 * - Transfer Out
                 */
                int netMovement = purchaseQuantity
                                + transferIn
                                - transferOut;

                /*
                 * ============================================================
                 * OPENING BALANCE
                 * ============================================================
                 *
                 * Closing =
                 * Opening
                 * + Purchases
                 * + Transfer In
                 * - Transfer Out
                 * - Expenditure
                 *
                 * Therefore:
                 *
                 * Opening =
                 * Closing
                 * - Purchases
                 * - Transfer In
                 * + Transfer Out
                 * + Expenditure
                 */
                Base selectedBase = base;
                EquipmentType selectedEquipmentType = equipmentType;

                int purchasesAfterEnd = purchaseRepository
                                .findByPurchaseDateAfter(endDate)
                                .stream()
                                .filter(purchase -> selectedBase == null
                                                || purchase.getBase().getId().equals(selectedBase.getId()))
                                .filter(purchase -> selectedEquipmentType == null
                                                || purchase.getEquipmentType().getId()
                                                                .equals(selectedEquipmentType.getId()))
                                .mapToInt(Purchase::getQuantity)
                                .sum();

                int transferInAfterEnd = 0;
                int transferOutAfterEnd = 0;
                for (Transfer transfer : transferRepository.findByTransferDateAfter(endDate)) {
                        if (selectedEquipmentType != null
                                        && !transfer.getEquipmentType().getId().equals(selectedEquipmentType.getId())) {
                                continue;
                        }

                        if (selectedBase == null) {
                                transferInAfterEnd += transfer.getQuantity();
                                transferOutAfterEnd += transfer.getQuantity();
                        } else {
                                if (transfer.getToBase().getId().equals(selectedBase.getId())) {
                                        transferInAfterEnd += transfer.getQuantity();
                                }
                                if (transfer.getFromBase().getId().equals(selectedBase.getId())) {
                                        transferOutAfterEnd += transfer.getQuantity();
                                }
                        }
                }

                int expenditureAfterEnd = expenditureRepository
                                .findByExpenditureDateAfter(endDate)
                                .stream()
                                .filter(expenditure -> selectedBase == null
                                                || expenditure.getBase().getId().equals(selectedBase.getId()))
                                .filter(expenditure -> selectedEquipmentType == null
                                                || expenditure.getEquipmentType().getId()
                                                                .equals(selectedEquipmentType.getId()))
                                .mapToInt(Expenditure::getQuantity)
                                .sum();

                int closingBalance = currentBalance
                                - purchasesAfterEnd
                                - transferInAfterEnd
                                + transferOutAfterEnd
                                + expenditureAfterEnd;

                int openingBalance = closingBalance
                                - purchaseQuantity
                                - transferIn
                                + transferOut
                                + expenditureQuantity;

                return new DashboardResponse(
                                openingBalance,
                                purchaseQuantity,
                                transferIn,
                                transferOut,
                                netMovement,
                                assigned,
                                expenditureQuantity,
                                closingBalance);
        }

        public MovementDetailsResponse getMovementDetails(
                        Long baseId,
                        Long equipmentTypeId,
                        LocalDate startDate,
                        LocalDate endDate) {
                User user = currentUserService.getCurrentUser();

                if (endDate == null) {
                        endDate = LocalDate.now();
                }

                if (startDate == null) {
                        startDate = endDate;
                }

                if (startDate.isAfter(endDate)) {
                        throw new IllegalArgumentException(
                                        "Start date cannot be after end date");
                }

                // Base Commander can only access their assigned base
                if (user.getRole() == Role.BASE_COMMANDER) {

                        if (user.getBase() == null) {
                                throw new AccessDeniedException(
                                                "Base commander is not assigned to a base");
                        }

                        if (baseId != null &&
                                        !user.getBase().getId().equals(baseId)) {

                                throw new AccessDeniedException(
                                                "You are not authorized to access this base");
                        }

                        baseId = user.getBase().getId();
                }

                Base base = null;

                if (baseId != null) {
                        base = baseRepository.findById(baseId)
                                        .orElseThrow(() -> new IllegalArgumentException("Base not found"));
                }

                EquipmentType equipmentType = null;

                if (equipmentTypeId != null) {
                        equipmentType = equipmentTypeRepository.findById(equipmentTypeId)
                                        .orElseThrow(() -> new IllegalArgumentException(
                                                        "Equipment type not found"));
                }

                // Purchases
                long purchases = 0;

                List<Purchase> purchasesList;

                if (base != null && equipmentType != null) {
                        purchasesList = purchaseRepository
                                        .findByBaseAndEquipmentTypeAndPurchaseDateBetween(
                                                        base,
                                                        equipmentType,
                                                        startDate,
                                                        endDate);
                } else if (base != null) {
                        purchasesList = purchaseRepository
                                        .findByBaseAndPurchaseDateBetween(
                                                        base,
                                                        startDate,
                                                        endDate);
                } else if (equipmentType != null) {
                        purchasesList = purchaseRepository
                                        .findByEquipmentTypeAndPurchaseDateBetween(
                                                        equipmentType,
                                                        startDate,
                                                        endDate);
                } else {
                        purchasesList = purchaseRepository
                                        .findByPurchaseDateBetween(
                                                        startDate,
                                                        endDate);
                }

                purchases = purchasesList.stream()
                                .mapToLong(Purchase::getQuantity)
                                .sum();

                // Transfers
                long transferIn = 0;
                long transferOut = 0;

                List<Transfer> transfers;

                if (base != null && equipmentType != null) {

                        transfers = transferRepository
                                        .findByBaseAndEquipmentTypeAndTransferDateBetween(
                                                        base,
                                                        equipmentType,
                                                        startDate,
                                                        endDate);

                        for (Transfer transfer : transfers) {

                                if (transfer.getToBase().getId()
                                                .equals(base.getId())) {

                                        transferIn += transfer.getQuantity();
                                }

                                if (transfer.getFromBase().getId()
                                                .equals(base.getId())) {

                                        transferOut += transfer.getQuantity();
                                }
                        }

                } else if (base != null) {

                        transfers = transferRepository
                                        .findByFromBaseOrToBaseAndTransferDate(
                                                        base,
                                                        base,
                                                        startDate,
                                                        endDate);

                        for (Transfer transfer : transfers) {

                                if (transfer.getToBase().getId()
                                                .equals(base.getId())) {

                                        transferIn += transfer.getQuantity();
                                }

                                if (transfer.getFromBase().getId()
                                                .equals(base.getId())) {

                                        transferOut += transfer.getQuantity();
                                }
                        }

                } else if (equipmentType != null) {

                        transfers = transferRepository
                                        .findByEquipmentTypeAndTransferDateBetween(
                                                        equipmentType,
                                                        startDate,
                                                        endDate);

                        for (Transfer transfer : transfers) {
                                transferIn += transfer.getQuantity();
                                transferOut += transfer.getQuantity();
                        }

                } else {

                        transfers = transferRepository
                                        .findByTransferDateBetween(
                                                        startDate,
                                                        endDate);

                        for (Transfer transfer : transfers) {
                                transferIn += transfer.getQuantity();
                                transferOut += transfer.getQuantity();
                        }
                }

                return new MovementDetailsResponse(
                                purchases,
                                transferIn,
                                transferOut);
        }
}