package com.mams.military_asset_management.service;

import com.mams.military_asset_management.entity.*;
import com.mams.military_asset_management.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final BaseRepository baseRepository;
    private final EquipmentTypeRepository equipmentTypeRepository;
    private final UserRepository userRepository;
    private final InventoryRepository inventoryRepository;
    private final AuditLogRepository auditLogRepository;

    public PurchaseService(
            PurchaseRepository purchaseRepository,
            BaseRepository baseRepository,
            EquipmentTypeRepository equipmentTypeRepository,
            UserRepository userRepository,
            InventoryRepository inventoryRepository,
            AuditLogRepository auditLogRepository
    ) {
        this.purchaseRepository = purchaseRepository;
        this.baseRepository = baseRepository;
        this.equipmentTypeRepository = equipmentTypeRepository;
        this.userRepository = userRepository;
        this.inventoryRepository = inventoryRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public Purchase createPurchase(
            Long baseId,
            Long equipmentTypeId,
            Long userId,
            Integer quantity,
            LocalDate purchaseDate,
            String supplier,
            String invoiceNumber,
            String remarks
    ) {

        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException(
                    "Purchase quantity must be greater than zero"
            );
        }

        Base base = baseRepository.findById(baseId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Base not found")
                );

        EquipmentType equipmentType = equipmentTypeRepository.findById(equipmentTypeId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Equipment type not found")
                );

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        Purchase purchase = new Purchase();

        purchase.setBase(base);
        purchase.setEquipmentType(equipmentType);
        purchase.setCreatedBy(user);
        purchase.setQuantity(quantity);
        purchase.setPurchaseDate(
                purchaseDate != null ? purchaseDate : LocalDate.now()
        );
        purchase.setSupplier(supplier);
        purchase.setInvoiceNumber(invoiceNumber);
        purchase.setRemarks(remarks);

        Purchase savedPurchase = purchaseRepository.save(purchase);

        Inventory inventory = inventoryRepository
                .findByBaseAndEquipmentType(base, equipmentType)
                .orElseGet(() ->
                        new Inventory(base, equipmentType)
                );

        inventory.setQuantity(
                inventory.getQuantity() + quantity
        );

        inventoryRepository.save(inventory);

        AuditLog auditLog = new AuditLog();

        auditLog.setUser(user);
        auditLog.setAction("PURCHASE_CREATED");
        auditLog.setEntityType("PURCHASE");
        auditLog.setEntityId(savedPurchase.getId());
        auditLog.setBase(base);
        auditLog.setStatus("SUCCESS");
        auditLog.setDetails(
                "Purchased " + quantity + " units of "
                        + equipmentType.getName()
        );

        auditLogRepository.save(auditLog);

        return savedPurchase;
    }
}