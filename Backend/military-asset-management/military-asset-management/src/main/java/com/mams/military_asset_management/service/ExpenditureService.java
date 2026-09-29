package com.mams.military_asset_management.service;

import com.mams.military_asset_management.entity.AuditLog;
import com.mams.military_asset_management.entity.Base;
import com.mams.military_asset_management.entity.EquipmentType;
import com.mams.military_asset_management.entity.Expenditure;
import com.mams.military_asset_management.entity.Inventory;
import com.mams.military_asset_management.entity.User;
import com.mams.military_asset_management.repository.AuditLogRepository;
import com.mams.military_asset_management.repository.BaseRepository;
import com.mams.military_asset_management.repository.EquipmentTypeRepository;
import com.mams.military_asset_management.repository.ExpenditureRepository;
import com.mams.military_asset_management.repository.InventoryRepository;
import com.mams.military_asset_management.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class ExpenditureService {

    private final ExpenditureRepository expenditureRepository;
    private final BaseRepository baseRepository;
    private final EquipmentTypeRepository equipmentTypeRepository;
    private final UserRepository userRepository;
    private final InventoryRepository inventoryRepository;
    private final AuditLogRepository auditLogRepository;

    public ExpenditureService(
            ExpenditureRepository expenditureRepository,
            BaseRepository baseRepository,
            EquipmentTypeRepository equipmentTypeRepository,
            UserRepository userRepository,
            InventoryRepository inventoryRepository,
            AuditLogRepository auditLogRepository
    ) {
        this.expenditureRepository = expenditureRepository;
        this.baseRepository = baseRepository;
        this.equipmentTypeRepository = equipmentTypeRepository;
        this.userRepository = userRepository;
        this.inventoryRepository = inventoryRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public Expenditure createExpenditure(
            Long baseId,
            Long equipmentTypeId,
            Long userId,
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

        Base base = baseRepository.findById(baseId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Base not found"));

        EquipmentType equipmentType = equipmentTypeRepository.findById(equipmentTypeId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Equipment type not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        Inventory inventory = inventoryRepository
                .findByBaseAndEquipmentType(base, equipmentType)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No inventory found for this equipment at the selected base"
                        ));

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
        expenditure.setExpenditureDate(
                expenditureDate != null
                        ? expenditureDate
                        : LocalDate.now()
        );
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
                        + " for "
                        + reason
        );

        auditLogRepository.save(auditLog);

        return savedExpenditure;
    }
}