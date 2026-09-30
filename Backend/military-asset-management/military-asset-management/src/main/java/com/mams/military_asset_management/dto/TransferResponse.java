package com.mams.military_asset_management.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TransferResponse {

    private Long id;

    private Long fromBaseId;
    private String fromBaseName;

    private Long toBaseId;
    private String toBaseName;

    private Long equipmentTypeId;
    private String equipmentTypeName;

    private Integer quantity;
    private LocalDate transferDate;
    private String referenceNumber;
    private String remarks;

    private String createdBy;
    private LocalDateTime createdAt;

    public TransferResponse(
            Long id,
            Long fromBaseId,
            String fromBaseName,
            Long toBaseId,
            String toBaseName,
            Long equipmentTypeId,
            String equipmentTypeName,
            Integer quantity,
            LocalDate transferDate,
            String referenceNumber,
            String remarks,
            String createdBy,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.fromBaseId = fromBaseId;
        this.fromBaseName = fromBaseName;
        this.toBaseId = toBaseId;
        this.toBaseName = toBaseName;
        this.equipmentTypeId = equipmentTypeId;
        this.equipmentTypeName = equipmentTypeName;
        this.quantity = quantity;
        this.transferDate = transferDate;
        this.referenceNumber = referenceNumber;
        this.remarks = remarks;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getFromBaseId() {
        return fromBaseId;
    }

    public String getFromBaseName() {
        return fromBaseName;
    }

    public Long getToBaseId() {
        return toBaseId;
    }

    public String getToBaseName() {
        return toBaseName;
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

    public LocalDate getTransferDate() {
        return transferDate;
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public String getRemarks() {
        return remarks;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}