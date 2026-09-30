package com.mams.military_asset_management.service;

import com.mams.military_asset_management.entity.AuditLog;
import com.mams.military_asset_management.entity.Base;
import com.mams.military_asset_management.entity.EquipmentType;
import com.mams.military_asset_management.entity.Expenditure;
import com.mams.military_asset_management.entity.Inventory;
import com.mams.military_asset_management.entity.Role;
import com.mams.military_asset_management.entity.User;
import com.mams.military_asset_management.repository.AuditLogRepository;
import com.mams.military_asset_management.repository.BaseRepository;
import com.mams.military_asset_management.repository.EquipmentTypeRepository;
import com.mams.military_asset_management.repository.ExpenditureRepository;
import com.mams.military_asset_management.repository.InventoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ExpenditureService {

    private final ExpenditureRepository expenditureRepository;
    private final BaseRepository baseRepository;
    private final EquipmentTypeRepository equipmentTypeRepository;
    private final InventoryRepository inventoryRepository;
    private final AuditLogRepository auditLogRepository;
    private final CurrentUserService currentUserService;
    private final AuthorizationService authorizationService;

    public ExpenditureService(
            ExpenditureRepository expenditureRepository,
            BaseRepository baseRepository,
            EquipmentTypeRepository equipmentTypeRepository,
            InventoryRepository inventoryRepository,
            AuditLogRepository auditLogRepository,
            CurrentUserService currentUserService,
            AuthorizationService authorizationService
    ) {
        this.expenditureRepository = expenditureRepository;
        this.baseRepository = baseRepository;
        this.equipmentTypeRepository = equipmentTypeRepository;
        this.inventoryRepository = inventoryRepository;
        this.auditLogRepository = auditLogRepository;
        this.currentUserService = currentUserService;
        this.authorizationService = authorizationService;
    }

    @Transactional
    public Expenditure createExpenditure(
            Long baseId,
            Long equipmentTypeId,
            Integer quantity,
            String reason,
            LocalDate expenditureDate,
            String referenceNumber,
            String personnelOrUnit,
            String remarks
    ) {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException(
                    "Expenditure quantity must be greater than zero"
            );
        }

        User user = currentUserService.getCurrentUser();

        Base base = baseRepository.findById(baseId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Base not found")
                );

        EquipmentType equipmentType =
                equipmentTypeRepository.findById(equipmentTypeId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Equipment type not found"
                                )
                        );

        authorizationService.checkBaseAccess(user, base);

        Inventory inventory = inventoryRepository
                .findByBaseAndEquipmentType(base, equipmentType)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Inventory record not found"
                        )
                );

        int availableQuantity =
                inventory.getQuantity() - inventory.getAssignedQuantity();

        if (quantity > availableQuantity) {
            throw new IllegalArgumentException(
                    "Insufficient available inventory. Available quantity: "
                            + availableQuantity
            );
        }

        inventory.setQuantity(
                inventory.getQuantity() - quantity
        );

        inventoryRepository.save(inventory);

        Expenditure expenditure = new Expenditure();

        expenditure.setBase(base);
        expenditure.setEquipmentType(equipmentType);
        expenditure.setRecordedBy(user);
        expenditure.setQuantity(quantity);
        expenditure.setReason(reason);
        expenditure.setExpenditureDate(expenditureDate);
        expenditure.setReferenceNumber(referenceNumber);
        expenditure.setPersonnelOrUnit(personnelOrUnit);
        expenditure.setRemarks(remarks);

        Expenditure savedExpenditure =
                expenditureRepository.save(expenditure);

        AuditLog auditLog = new AuditLog();

        auditLog.setUser(user);
        auditLog.setAction("EXPENDITURE_CREATED");
        auditLog.setEntityType("EXPENDITURE");
        auditLog.setEntityId(savedExpenditure.getId());
        auditLog.setBase(base);
        auditLog.setStatus("SUCCESS");

        auditLog.setDetails(
                "Expended "
                        + quantity
                        + " units of "
                        + equipmentType.getName()
                        + " at "
                        + base.getName()
        );

        auditLogRepository.save(auditLog);

        return savedExpenditure;
    }

    public List<Expenditure> getExpenditures(
            Long baseId,
            Long equipmentTypeId,
            LocalDate startDate,
            LocalDate endDate
    ) {
        User user = currentUserService.getCurrentUser();

        if (endDate == null) {
            endDate = LocalDate.now();
        }

        if (startDate == null) {
            startDate = endDate;
        }

        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException(
                    "Start date cannot be after end date"
            );
        }

        if (user.getRole() == Role.LOGISTICS_OFFICER) {
            throw new AccessDeniedException(
                    "You are not authorized to view expenditures"
            );
        }

        if (user.getRole() == Role.BASE_COMMANDER) {

            if (user.getBase() == null) {
                throw new AccessDeniedException(
                        "Base commander is not assigned to a base"
                );
            }

            if (baseId != null &&
                    !user.getBase().getId().equals(baseId)) {

                throw new AccessDeniedException(
                        "You are not authorized to access this base"
                );
            }

            baseId = user.getBase().getId();
        }

        Base base = null;

        if (baseId != null) {
            base = baseRepository.findById(baseId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Base not found"
                            )
                    );
        }

        EquipmentType equipmentType = null;

        if (equipmentTypeId != null) {
            equipmentType =
                    equipmentTypeRepository.findById(equipmentTypeId)
                            .orElseThrow(() ->
                                    new IllegalArgumentException(
                                            "Equipment type not found"
                                    )
                            );
        }

        if (base != null && equipmentType != null) {
            return expenditureRepository
                    .findByBaseAndEquipmentTypeAndExpenditureDateBetween(
                            base,
                            equipmentType,
                            startDate,
                            endDate
                    );
        }

        if (base != null) {
            return expenditureRepository
                    .findByBaseAndExpenditureDateBetween(
                            base,
                            startDate,
                            endDate
                    );
        }

        if (equipmentType != null) {
            return expenditureRepository
                    .findByEquipmentTypeAndExpenditureDateBetween(
                            equipmentType,
                            startDate,
                            endDate
                    );
        }

        return expenditureRepository.findByExpenditureDateBetween(
                startDate,
                endDate
        );
    }
}