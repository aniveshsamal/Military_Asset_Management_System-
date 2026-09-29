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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class ExpenditureService {

    private final ExpenditureRepository expenditureRepository;
    private final BaseRepository baseRepository;
    private final EquipmentTypeRepository equipmentTypeRepository;
    private final InventoryRepository inventoryRepository;
    private final AuditLogRepository auditLogRepository;
    private final AuthorizationService authorizationService;
    private final CurrentUserService currentUserService;

    public ExpenditureService(
            ExpenditureRepository expenditureRepository,
            BaseRepository baseRepository,
            EquipmentTypeRepository equipmentTypeRepository,
            InventoryRepository inventoryRepository,
            AuditLogRepository auditLogRepository,
            AuthorizationService authorizationService,
            CurrentUserService currentUserService
    ) {
        this.expenditureRepository = expenditureRepository;
        this.baseRepository = baseRepository;
        this.equipmentTypeRepository = equipmentTypeRepository;
        this.inventoryRepository = inventoryRepository;
        this.auditLogRepository = auditLogRepository;
        this.authorizationService = authorizationService;
        this.currentUserService = currentUserService;
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

        // Validate quantity
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException(
                    "Expenditure quantity must be greater than zero"
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

        // Check whether the authenticated user can access this base
        authorizationService.checkBaseAccess(user, base);

        // Find equipment type
        EquipmentType equipmentType =
                equipmentTypeRepository.findById(equipmentTypeId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Equipment type not found"
                                )
                        );

        // Find inventory
        Inventory inventory =
                inventoryRepository
                        .findByBaseAndEquipmentType(
                                base,
                                equipmentType
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "No inventory found for this equipment at the selected base"
                                )
                        );

        // Calculate available inventory
        int availableQuantity =
                inventory.getQuantity()
                        - inventory.getAssignedQuantity();

        // Prevent expenditure of unavailable assets
        if (quantity > availableQuantity) {
            throw new IllegalArgumentException(
                    "Insufficient available inventory. Available quantity: "
                            + availableQuantity
            );
        }

        // Reduce total inventory
        inventory.setQuantity(
                inventory.getQuantity() - quantity
        );

        inventoryRepository.save(inventory);

        // Create expenditure record
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

        // Create audit log
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