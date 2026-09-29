package com.mams.military_asset_management.service;

import com.mams.military_asset_management.entity.AuditLog;
import com.mams.military_asset_management.entity.Base;
import com.mams.military_asset_management.entity.EquipmentType;
import com.mams.military_asset_management.entity.Inventory;
import com.mams.military_asset_management.entity.Purchase;
import com.mams.military_asset_management.entity.User;
import com.mams.military_asset_management.repository.AuditLogRepository;
import com.mams.military_asset_management.repository.BaseRepository;
import com.mams.military_asset_management.repository.EquipmentTypeRepository;
import com.mams.military_asset_management.repository.InventoryRepository;
import com.mams.military_asset_management.repository.PurchaseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final BaseRepository baseRepository;
    private final EquipmentTypeRepository equipmentTypeRepository;
    private final InventoryRepository inventoryRepository;
    private final AuditLogRepository auditLogRepository;
    private final AuthorizationService authorizationService;
    private final CurrentUserService currentUserService;

    public PurchaseService(
            PurchaseRepository purchaseRepository,
            BaseRepository baseRepository,
            EquipmentTypeRepository equipmentTypeRepository,
            InventoryRepository inventoryRepository,
            AuditLogRepository auditLogRepository,
            AuthorizationService authorizationService,
            CurrentUserService currentUserService
    ) {
        this.purchaseRepository = purchaseRepository;
        this.baseRepository = baseRepository;
        this.equipmentTypeRepository = equipmentTypeRepository;
        this.inventoryRepository = inventoryRepository;
        this.auditLogRepository = auditLogRepository;
        this.authorizationService = authorizationService;
        this.currentUserService = currentUserService;
    }

    @Transactional
    public Purchase createPurchase(
            Long baseId,
            Long equipmentTypeId,
            Integer quantity,
            LocalDate purchaseDate,
            String supplier,
            String invoiceNumber,
            String remarks
    ) {

        // Validate quantity
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException(
                    "Purchase quantity must be greater than zero"
            );
        }

        // Get authenticated user from JWT
        User user = currentUserService.getCurrentUser();

        // Find base
        Base base = baseRepository.findById(baseId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Base not found"
                        )
                );

        // Check whether authenticated user can access this base
        authorizationService.checkBaseAccess(user, base);

        // Find equipment type
        EquipmentType equipmentType =
                equipmentTypeRepository.findById(equipmentTypeId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Equipment type not found"
                                )
                        );

        // Create purchase record
        Purchase purchase = new Purchase();

        purchase.setBase(base);
        purchase.setEquipmentType(equipmentType);
        purchase.setCreatedBy(user);
        purchase.setQuantity(quantity);

        purchase.setPurchaseDate(
                purchaseDate != null
                        ? purchaseDate
                        : LocalDate.now()
        );

        purchase.setSupplier(supplier);
        purchase.setInvoiceNumber(invoiceNumber);
        purchase.setRemarks(remarks);

        Purchase savedPurchase =
                purchaseRepository.save(purchase);

        // Find or create inventory
        Inventory inventory =
                inventoryRepository
                        .findByBaseAndEquipmentType(
                                base,
                                equipmentType
                        )
                        .orElseGet(() ->
                                new Inventory(
                                        base,
                                        equipmentType
                                )
                        );

        // Add purchased quantity to inventory
        inventory.setQuantity(
                inventory.getQuantity() + quantity
        );

        inventoryRepository.save(inventory);

        // Create audit log
        AuditLog auditLog = new AuditLog();

        auditLog.setUser(user);
        auditLog.setAction("PURCHASE_CREATED");
        auditLog.setEntityType("PURCHASE");
        auditLog.setEntityId(savedPurchase.getId());
        auditLog.setBase(base);
        auditLog.setStatus("SUCCESS");

        auditLog.setDetails(
                "Purchased "
                        + quantity
                        + " units of "
                        + equipmentType.getName()
        );

        auditLogRepository.save(auditLog);

        return savedPurchase;
    }
}