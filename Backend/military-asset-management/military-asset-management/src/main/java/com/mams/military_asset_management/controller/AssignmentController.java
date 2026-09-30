package com.mams.military_asset_management.controller;

import com.mams.military_asset_management.dto.AssignmentRequest;
import com.mams.military_asset_management.dto.AssignmentResponse;
import com.mams.military_asset_management.entity.Assignment;
import com.mams.military_asset_management.service.AssignmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

        private final AssignmentService assignmentService;

        public AssignmentController(
                        AssignmentService assignmentService) {
                this.assignmentService = assignmentService;
        }

        @PostMapping
        @ResponseStatus(HttpStatus.CREATED)
        public AssignmentResponse createAssignment(
                        @Valid @RequestBody AssignmentRequest request) {

                Assignment assignment = assignmentService.createAssignment(
                                request.getBaseId(),
                                request.getEquipmentTypeId(),
                                request.getPersonnelName(),
                                request.getQuantity(),
                                request.getAssignmentDate(),
                                request.getRemarks());

                return toResponse(assignment);
        }

        @GetMapping
        @Transactional(readOnly = true)
        public List<AssignmentResponse> getAssignments(
                        @RequestParam(required = false) Long baseId,
                        @RequestParam(required = false) Long equipmentTypeId,
                        @RequestParam(required = false) LocalDate startDate,
                        @RequestParam(required = false) LocalDate endDate) {

                return assignmentService.getAssignments(
                                baseId,
                                equipmentTypeId,
                                startDate,
                                endDate).stream().map(this::toResponse).toList();
        }

        @PutMapping("/{id}/return")
        public AssignmentResponse returnAssignment(
                        @PathVariable Long id) {
                return toResponse(assignmentService.returnAssignment(id));
        }

        private AssignmentResponse toResponse(Assignment assignment) {
                return new AssignmentResponse(
                                assignment.getId(),
                                assignment.getBase().getId(),
                                assignment.getBase().getName(),
                                assignment.getEquipmentType().getId(),
                                assignment.getEquipmentType().getName(),
                                assignment.getPersonnelName(),
                                assignment.getQuantity(),
                                assignment.getAssignmentDate(),
                                assignment.getStatus(),
                                assignment.getRemarks(),
                                assignment.getCreatedAt());
        }
}