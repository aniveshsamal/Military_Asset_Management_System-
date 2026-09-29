package com.mams.military_asset_management.service;

import com.mams.military_asset_management.entity.Assignment;
import com.mams.military_asset_management.entity.AuditLog;
import com.mams.military_asset_management.entity.Base;
import com.mams.military_asset_management.entity.EquipmentType;
import com.mams.military_asset_management.entity.Inventory;
import com.mams.military_asset_management.entity.User;
import com.mams.military_asset_management.repository.AssignmentRepository;
import com.mams.military_asset_management.repository.AuditLogRepository;
import com.mams.military_asset_management.repository.BaseRepository;
import com.mams.military_asset_management.repository.EquipmentTypeRepository;
import com.mams.military_asset_management.repository.InventoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final BaseRepository baseRepository;
    private final EquipmentTypeRepository equipmentTypeRepository;
    private final InventoryRepository inventoryRepository;
    private final AuditLogRepository auditLogRepository;
    private final AuthorizationService authorizationService;
    private final CurrentUserService currentUserService;

    public AssignmentService(
            AssignmentRepository assignmentRepository,
            BaseRepository baseRepository,
            EquipmentTypeRepository equipmentTypeRepository,
            InventoryRepository inventoryRepository,
            AuditLogRepository auditLogRepository,
            AuthorizationService authorizationService,
            CurrentUserService currentUserService
    ) {
        this.assignmentRepository = assignmentRepository;
        this.baseRepository = baseRepository;
        this.equipmentTypeRepository = equipmentTypeRepository;
        this.inventoryRepository = inventoryRepository;
        this.auditLogRepository = auditLogRepository;
        this.authorizationService = authorizationService;
        this.currentUserService = currentUserService;
    }

    @Transactional
    public Assignment createAssignment(
            Long baseId,
            Long equipmentTypeId,
            String personnelName,
            Integer quantity,
            LocalDate assignmentDate,
            String remarks
    ) {

        // Validate quantity
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException(
                    "Assignment quantity must be greater than zero"
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

        // Prevent assignment of unavailable assets
        if (quantity > availableQuantity) {
            throw new IllegalArgumentException(
                    "Insufficient available inventory. Available quantity: "
                            + availableQuantity
            );
        }

        // Increase assigned quantity
        inventory.setAssignedQuantity(
                inventory.getAssignedQuantity() + quantity
        );

        inventoryRepository.save(inventory);

        // Create assignment record
        Assignment assignment = new Assignment();

        assignment.setBase(base);
        assignment.setEquipmentType(equipmentType);
        assignment.setAssignedBy(user);
        assignment.setPersonnelName(personnelName);
        assignment.setQuantity(quantity);

        assignment.setAssignmentDate(
                assignmentDate != null
                        ? assignmentDate
                        : LocalDate.now()
        );

        assignment.setStatus("ACTIVE");
        assignment.setRemarks(remarks);

        Assignment savedAssignment =
                assignmentRepository.save(assignment);

        // Create audit log
        AuditLog auditLog = new AuditLog();

        auditLog.setUser(user);
        auditLog.setAction("ASSIGNMENT_CREATED");
        auditLog.setEntityType("ASSIGNMENT");
        auditLog.setEntityId(savedAssignment.getId());
        auditLog.setBase(base);
        auditLog.setStatus("SUCCESS");

        auditLog.setDetails(
                "Assigned "
                        + quantity
                        + " units of "
                        + equipmentType.getName()
                        + " to "
                        + personnelName
        );

        auditLogRepository.save(auditLog);

        return savedAssignment;
    }
}