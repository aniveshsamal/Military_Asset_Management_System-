package com.mams.military_asset_management.service;

import com.mams.military_asset_management.entity.AuditLog;
import com.mams.military_asset_management.entity.Base;
import com.mams.military_asset_management.entity.EquipmentType;
import com.mams.military_asset_management.entity.Inventory;
import com.mams.military_asset_management.entity.Transfer;
import com.mams.military_asset_management.entity.User;
import com.mams.military_asset_management.repository.AuditLogRepository;
import com.mams.military_asset_management.repository.BaseRepository;
import com.mams.military_asset_management.repository.EquipmentTypeRepository;
import com.mams.military_asset_management.repository.InventoryRepository;
import com.mams.military_asset_management.repository.TransferRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class TransferService {

    private final TransferRepository transferRepository;
    private final BaseRepository baseRepository;
    private final EquipmentTypeRepository equipmentTypeRepository;
    private final InventoryRepository inventoryRepository;
    private final AuditLogRepository auditLogRepository;
    private final AuthorizationService authorizationService;
    private final CurrentUserService currentUserService;

    public TransferService(
            TransferRepository transferRepository,
            BaseRepository baseRepository,
            EquipmentTypeRepository equipmentTypeRepository,
            InventoryRepository inventoryRepository,
            AuditLogRepository auditLogRepository,
            AuthorizationService authorizationService,
            CurrentUserService currentUserService
    ) {
        this.transferRepository = transferRepository;
        this.baseRepository = baseRepository;
        this.equipmentTypeRepository = equipmentTypeRepository;
        this.inventoryRepository = inventoryRepository;
        this.auditLogRepository = auditLogRepository;
        this.authorizationService = authorizationService;
        this.currentUserService = currentUserService;
    }

    @Transactional
    public Transfer createTransfer(
            Long fromBaseId,
            Long toBaseId,
            Long equipmentTypeId,
            Integer quantity,
            LocalDate transferDate,
            String referenceNumber,
            String remarks
    ) {

        // Validate quantity
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException(
                    "Transfer quantity must be greater than zero"
            );
        }

        // Source and destination must be different
        if (fromBaseId.equals(toBaseId)) {
            throw new IllegalArgumentException(
                    "Source and destination bases must be different"
            );
        }

        // Get authenticated user from JWT
        User user = currentUserService.getCurrentUser();

        // Find source base
        Base fromBase = baseRepository.findById(fromBaseId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Source base not found"
                        )
                );

        // Find destination base
        Base toBase = baseRepository.findById(toBaseId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Destination base not found"
                        )
                );

        // Check transfer authorization
        authorizationService.checkTransferAccess(
                user,
                fromBase,
                toBase
        );

        // Find equipment type
        EquipmentType equipmentType =
                equipmentTypeRepository.findById(equipmentTypeId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Equipment type not found"
                                )
                        );

        // Find source inventory
        Inventory sourceInventory =
                inventoryRepository
                        .findByBaseAndEquipmentType(
                                fromBase,
                                equipmentType
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "No inventory found at source base"
                                )
                        );

        // Calculate available source inventory
        int availableQuantity =
                sourceInventory.getQuantity()
                        - sourceInventory.getAssignedQuantity();

        // Prevent transfer of unavailable assets
        if (quantity > availableQuantity) {
            throw new IllegalArgumentException(
                    "Insufficient available inventory at source base. "
                            + "Available quantity: "
                            + availableQuantity
            );
        }

        // Remove quantity from source base
        sourceInventory.setQuantity(
                sourceInventory.getQuantity() - quantity
        );

        inventoryRepository.save(sourceInventory);

        // Find or create destination inventory
        Inventory destinationInventory =
                inventoryRepository
                        .findByBaseAndEquipmentType(
                                toBase,
                                equipmentType
                        )
                        .orElseGet(() ->
                                new Inventory(
                                        toBase,
                                        equipmentType
                                )
                        );

        // Add quantity to destination base
        destinationInventory.setQuantity(
                destinationInventory.getQuantity() + quantity
        );

        inventoryRepository.save(destinationInventory);

        // Create transfer record
        Transfer transfer = new Transfer();

        transfer.setFromBase(fromBase);
        transfer.setToBase(toBase);
        transfer.setEquipmentType(equipmentType);
        transfer.setCreatedBy(user);
        transfer.setQuantity(quantity);

        transfer.setTransferDate(
                transferDate != null
                        ? transferDate
                        : LocalDate.now()
        );

        transfer.setReferenceNumber(referenceNumber);
        transfer.setRemarks(remarks);

        Transfer savedTransfer =
                transferRepository.save(transfer);

        // Create audit log
        AuditLog auditLog = new AuditLog();

        auditLog.setUser(user);
        auditLog.setAction("TRANSFER_CREATED");
        auditLog.setEntityType("TRANSFER");
        auditLog.setEntityId(savedTransfer.getId());
        auditLog.setBase(fromBase);
        auditLog.setStatus("SUCCESS");

        auditLog.setDetails(
                "Transferred "
                        + quantity
                        + " units of "
                        + equipmentType.getName()
                        + " from "
                        + fromBase.getName()
                        + " to "
                        + toBase.getName()
        );

        auditLogRepository.save(auditLog);

        return savedTransfer;
    }
}