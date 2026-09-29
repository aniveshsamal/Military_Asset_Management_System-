package com.mams.military_asset_management.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "transfers")
public class Transfer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "from_base_id", nullable = false)
    private Base fromBase;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "to_base_id", nullable = false)
    private Base toBase;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "equipment_type_id", nullable = false)
    private EquipmentType equipmentType;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private LocalDate transferDate;

    @Column(length = 100)
    private String referenceNumber;

    @Column(length = 500)
    private String remarks;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Transfer() {
    }

    public Long getId() {
        return id;
    }

    public Base getFromBase() {
        return fromBase;
    }

    public Base getToBase() {
        return toBase;
    }

    public EquipmentType getEquipmentType() {
        return equipmentType;
    }

    public User getCreatedBy() {
        return createdBy;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setFromBase(Base fromBase) {
        this.fromBase = fromBase;
    }

    public void setToBase(Base toBase) {
        this.toBase = toBase;
    }

    public void setEquipmentType(EquipmentType equipmentType) {
        this.equipmentType = equipmentType;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setTransferDate(LocalDate transferDate) {
        this.transferDate = transferDate;
    }

    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}