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

import com.mams.military_asset_management.entity.Role;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;


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
    @Transactional
    public Assignment returnAssignment(Long assignmentId) {

        User user = currentUserService.getCurrentUser();

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Assignment not found")
                );

        if (!"ACTIVE".equals(assignment.getStatus())) {
            throw new IllegalArgumentException(
                    "Assignment is already returned"
            );
        }

        authorizationService.checkBaseAccess(
                user,
                assignment.getBase()
        );

        Inventory inventory = inventoryRepository
                .findByBaseAndEquipmentType(
                        assignment.getBase(),
                        assignment.getEquipmentType()
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Inventory record not found"
                        )
                );

        if (inventory.getAssignedQuantity() < assignment.getQuantity()) {
            throw new IllegalArgumentException(
                    "Assigned quantity is inconsistent with inventory"
            );
        }

        inventory.setAssignedQuantity(
                inventory.getAssignedQuantity()
                        - assignment.getQuantity()
        );

        inventoryRepository.save(inventory);

        assignment.setStatus("RETURNED");

        Assignment savedAssignment =
                assignmentRepository.save(assignment);

        AuditLog auditLog = new AuditLog();

        auditLog.setUser(user);
        auditLog.setAction("ASSIGNMENT_RETURNED");
        auditLog.setEntityType("ASSIGNMENT");
        auditLog.setEntityId(savedAssignment.getId());
        auditLog.setBase(assignment.getBase());
        auditLog.setStatus("SUCCESS");

        auditLog.setDetails(
                "Returned "
                        + assignment.getQuantity()
                        + " units of "
                        + assignment.getEquipmentType().getName()
                        + " from "
                        + assignment.getPersonnelName()
        );

        auditLogRepository.save(auditLog);

        return savedAssignment;
    }

    public List<Assignment> getAssignments(
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

        // Base Commander can only view assignments from their assigned base
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
            return assignmentRepository
                    .findByBaseAndEquipmentTypeAndAssignmentDateBetween(
                            base,
                            equipmentType,
                            startDate,
                            endDate
                    );
        }

        if (base != null) {
            return assignmentRepository
                    .findByBaseAndAssignmentDateBetween(
                            base,
                            startDate,
                            endDate
                    );
        }

        if (equipmentType != null) {
            return assignmentRepository
                    .findByEquipmentTypeAndAssignmentDateBetween(
                            equipmentType,
                            startDate,
                            endDate
                    );
        }

        return assignmentRepository.findByAssignmentDateBetween(
                startDate,
                endDate
        );
    }
}