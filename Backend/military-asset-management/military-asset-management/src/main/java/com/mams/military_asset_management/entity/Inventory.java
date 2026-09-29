package com.mams.military_asset_management.entity;

import com.mams.military_asset_management.entity.Base;
import jakarta.persistence.*;

@Entity
@Table(
    name = "inventory",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_inventory_base_equipment",
            columnNames = {"base_id", "equipment_type_id"}
        )
    }
)
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "base_id", nullable = false)
    private Base base;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "equipment_type_id", nullable = false)
    private EquipmentType equipmentType;

    @Column(nullable = false)
    private Integer quantity = 0;

    @Column(nullable = false)
    private Integer assignedQuantity = 0;

    public Inventory() {
    }

    public Inventory(Base base, EquipmentType equipmentType) {
        this.base = base;
        this.equipmentType = equipmentType;
        this.quantity = 0;
        this.assignedQuantity = 0;
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

    public Integer getQuantity() {
        return quantity;
    }

    public Integer getAssignedQuantity() {
        return assignedQuantity;
    }

    public void setBase(Base base) {
        this.base = base;
    }

    public void setEquipmentType(EquipmentType equipmentType) {
        this.equipmentType = equipmentType;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setAssignedQuantity(Integer assignedQuantity) {
        this.assignedQuantity = assignedQuantity;
    }
}
