package com.mams.military_asset_management.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PurchaseResponse {

    private Long id;
    private Long baseId;
    private String baseName;
    private Long equipmentTypeId;
    private String equipmentTypeName;
    private Integer quantity;
    private LocalDate purchaseDate;
    private String supplier;
    private String invoiceNumber;
    private String remarks;
    private String createdBy;
    private LocalDateTime createdAt;

    public PurchaseResponse(
            Long id,
            Long baseId,
            String baseName,
            Long equipmentTypeId,
            String equipmentTypeName,
            Integer quantity,
            LocalDate purchaseDate,
            String supplier,
            String invoiceNumber,
            String remarks,
            String createdBy,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.baseId = baseId;
        this.baseName = baseName;
        this.equipmentTypeId = equipmentTypeId;
        this.equipmentTypeName = equipmentTypeName;
        this.quantity = quantity;
        this.purchaseDate = purchaseDate;
        this.supplier = supplier;
        this.invoiceNumber = invoiceNumber;
        this.remarks = remarks;
        this.createdBy = createdBy;
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

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    public String getSupplier() {
        return supplier;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
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