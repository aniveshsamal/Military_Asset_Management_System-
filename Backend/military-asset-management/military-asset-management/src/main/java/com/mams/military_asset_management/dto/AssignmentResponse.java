package com.mams.military_asset_management.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AssignmentResponse {

    private Long id;
    private Long baseId;
    private String baseName;
    private Long equipmentTypeId;
    private String equipmentTypeName;
    private String personnelName;
    private Integer quantity;
    private LocalDate assignmentDate;
    private String status;
    private String remarks;
    private LocalDateTime createdAt;

    public AssignmentResponse(
            Long id,
            Long baseId,
            String baseName,
            Long equipmentTypeId,
            String equipmentTypeName,
            String personnelName,
            Integer quantity,
            LocalDate assignmentDate,
            String status,
            String remarks,
            LocalDateTime createdAt) {
        this.id = id;
        this.baseId = baseId;
        this.baseName = baseName;
        this.equipmentTypeId = equipmentTypeId;
        this.equipmentTypeName = equipmentTypeName;
        this.personnelName = personnelName;
        this.quantity = quantity;
        this.assignmentDate = assignmentDate;
        this.status = status;
        this.remarks = remarks;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getBaseId() {
        return baseId;
    }

    public String getBaseName() {
        return baseName;
    }

    public Long getEquipmentTypeId() {
        return equipmentTypeId;
    }

    public String getEquipmentTypeName() {
        return equipmentTypeName;
    }

    public String getPersonnelName() {
        return personnelName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public LocalDate getAssignmentDate() {
        return assignmentDate;
    }

    public String getStatus() {
        return status;
    }

    public String getRemarks() {
        return remarks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
