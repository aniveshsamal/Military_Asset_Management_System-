package com.mams.military_asset_management.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ExpenditureResponse {

    private Long id;

    private Long baseId;
    private String baseName;

    private Long equipmentTypeId;
    private String equipmentTypeName;

    private Integer quantity;
    private String reason;
    private LocalDate expenditureDate;
    private String referenceNumber;
    private String personnelOrUnit;
    private String remarks;

    private String recordedBy;
    private LocalDateTime createdAt;

    public ExpenditureResponse(
            Long id,
            Long baseId,
            String baseName,
            Long equipmentTypeId,
            String equipmentTypeName,
            Integer quantity,
            String reason,
            LocalDate expenditureDate,
            String referenceNumber,
            String personnelOrUnit,
            String remarks,
            String recordedBy,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.baseId = baseId;
        this.baseName = baseName;
        this.equipmentTypeId = equipmentTypeId;
        this.equipmentTypeName = equipmentTypeName;
        this.quantity = quantity;
        this.reason = reason;
        this.expenditureDate = expenditureDate;
        this.referenceNumber = referenceNumber;
        this.personnelOrUnit = personnelOrUnit;
        this.remarks = remarks;
        this.recordedBy = recordedBy;
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

    public Integer getQuantity() {
        return quantity;
    }

    public String getReason() {
        return reason;
    }

    public LocalDate getExpenditureDate() {
        return expenditureDate;
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public String getPersonnelOrUnit() {
        return personnelOrUnit;
    }

    public String getRemarks() {
        return remarks;
    }

    public String getRecordedBy() {
        return recordedBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}