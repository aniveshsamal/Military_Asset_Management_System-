package com.mams.military_asset_management.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "expenditures")
public class Expenditure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "base_id", nullable = false)
    private Base base;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "equipment_type_id", nullable = false)
    private EquipmentType equipmentType;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recorded_by", nullable = false)
    private User recordedBy;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, length = 50)
    private String reason;

    @Column(nullable = false)
    private LocalDate expenditureDate;

    @Column(length = 100)
    private String referenceNumber;

    @Column(length = 150)
    private String personnelOrUnit;

    @Column(length = 500)
    private String remarks;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Expenditure() {
    }

    public Long getId() {
        return id;
    }

    public Base getBase() {
        return base;
    }

    public EquipmentType getEquipmentType() {
        return equipmentType;
    }

    public User getRecordedBy() {
        return recordedBy;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setBase(Base base) {
        this.base = base;
    }

    public void setEquipmentType(EquipmentType equipmentType) {
        this.equipmentType = equipmentType;
    }

    public void setRecordedBy(User recordedBy) {
        this.recordedBy = recordedBy;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public void setExpenditureDate(LocalDate expenditureDate) {
        this.expenditureDate = expenditureDate;
    }

    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }

    public void setPersonnelOrUnit(String personnelOrUnit) {
        this.personnelOrUnit = personnelOrUnit;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}