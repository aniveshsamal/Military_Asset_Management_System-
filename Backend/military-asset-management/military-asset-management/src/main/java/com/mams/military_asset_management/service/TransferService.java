package com.mams.military_asset_management.service;

import com.mams.military_asset_management.entity.*;
import com.mams.military_asset_management.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class TransferService {

    private final TransferRepository transferRepository;
    private final BaseRepository baseRepository;
    private final EquipmentTypeRepository equipmentTypeRepository;
    private final UserRepository userRepository;
    private final InventoryRepository inventoryRepository;
    private final AuditLogRepository auditLogRepository;

    public TransferService(
            TransferRepository transferRepository,
            BaseRepository baseRepository,
            EquipmentTypeRepository equipmentTypeRepository,
            UserRepository userRepository,
            InventoryRepository inventoryRepository,
            AuditLogRepository auditLogRepository
    ) {
        this.transferRepository = transferRepository;
        this.baseRepository = baseRepository;
        this.equipmentTypeRepository = equipmentTypeRepository;
        this.userRepository = userRepository;
        this.inventoryRepository = inventoryRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public Transfer createTransfer(
            Long fromBaseId,
            Long toBaseId,
            Long equipmentTypeId,
            Long userId,
            Integer quantity,
            LocalDate transferDate,
            String referenceNumber,
            String remarks
    ) {

        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException(
                    "Transfer quantity must be greater than zero"
            );
        }

        if (fromBaseId.equals(toBaseId)) {
            throw new IllegalArgumentException(
                    "Source and destination bases must be different"
            );
        }

        Base fromBase = baseRepository.findById(fromBaseId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Source base not found")
                );

        Base toBase = baseRepository.findById(toBaseId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Destination base not found")
                );

        EquipmentType equipmentType =
                equipmentTypeRepository.findById(equipmentTypeId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Equipment type not found"
                                )
                        );

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        /*
         * Lock the source inventory row while this transaction is running.
         */
        Inventory sourceInventory = inventoryRepository
                .findByBaseAndEquipmentType(fromBase, equipmentType)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No inventory found at source base"
                        )
                );

        int availableQuantity =
                sourceInventory.getQuantity()
                        - sourceInventory.getAssignedQuantity();

        if (quantity > availableQuantity) {
            throw new IllegalArgumentException(
                    "Insufficient available inventory at source base"
            );
        }

        /*
         * Decrease source inventory.
         */
        sourceInventory.setQuantity(
                sourceInventory.getQuantity() - quantity
        );

        inventoryRepository.save(sourceInventory);

        /*
         * Find or create destination inventory.
         */
        Inventory destinationInventory = inventoryRepository
                .findByBaseAndEquipmentType(toBase, equipmentType)
                .orElseGet(() ->
                        new Inventory(toBase, equipmentType)
                );

        destinationInventory.setQuantity(
                destinationInventory.getQuantity() + quantity
        );

        inventoryRepository.save(destinationInventory);

        /*
         * Create transfer record.
         */
        Transfer transfer = new Transfer();

        transfer.setFromBase(fromBase);
        transfer.setToBase(toBase);
        transfer.setEquipmentType(equipmentType);
        transfer.setCreatedBy(user);
        transfer.setQuantity(quantity);
        transfer.setTransferDate(
                transferDate != null ? transferDate : LocalDate.now()
        );
        transfer.setReferenceNumber(referenceNumber);
        transfer.setRemarks(remarks);

        Transfer savedTransfer = transferRepository.save(transfer);

        /*
         * Create audit log.
         */
        AuditLog auditLog = new AuditLog();

        auditLog.setUser(user);
        auditLog.setAction("TRANSFER_CREATED");
        auditLog.setEntityType("TRANSFER");
        auditLog.setEntityId(savedTransfer.getId());
        auditLog.setBase(fromBase);
        auditLog.setStatus("SUCCESS");

        auditLog.setDetails(
                "Transferred " + quantity
                        + " units of " + equipmentType.getName()
                        + " from " + fromBase.getName()
                        + " to " + toBase.getName()
        );

        auditLogRepository.save(auditLog);

        return savedTransfer;
    }
}