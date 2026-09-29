package com.mams.military_asset_management.controller;

import com.mams.military_asset_management.dto.AssignmentRequest;
import com.mams.military_asset_management.entity.Assignment;
import com.mams.military_asset_management.service.AssignmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Assignment createAssignment(
            @Valid @RequestBody AssignmentRequest request
    ) {

        return assignmentService.createAssignment(
                request.getBaseId(),
                request.getEquipmentTypeId(),
                request.getUserId(),
                request.getPersonnelName(),
                request.getQuantity(),
                request.getAssignmentDate(),
                request.getRemarks()
        );
    }
}