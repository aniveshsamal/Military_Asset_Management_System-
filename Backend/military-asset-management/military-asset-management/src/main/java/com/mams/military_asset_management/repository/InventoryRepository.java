package com.mams.military_asset_management.repository;

import com.mams.military_asset_management.entity.Base;
import com.mams.military_asset_management.entity.EquipmentType;
import com.mams.military_asset_management.entity.Inventory;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Inventory> findByBaseAndEquipmentType(
            Base base,
            EquipmentType equipmentType
    );

    @EntityGraph(attributePaths = {
            "base",
            "equipmentType"
    })
    List<Inventory> findAll();

    @EntityGraph(attributePaths = {
            "base",
            "equipmentType"
    })
    List<Inventory> findByBase(Base base);
}