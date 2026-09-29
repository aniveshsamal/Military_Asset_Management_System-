package com.mams.military_asset_management.repository;

import com.mams.military_asset_management.entity.Purchase;
import com.mams.military_asset_management.entity.Base;
import com.mams.military_asset_management.entity.EquipmentType;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {

    List<Purchase> findByBase(Base base);

    List<Purchase> findByEquipmentType(EquipmentType equipmentType);

    List<Purchase> findByPurchaseDateBetween(
            LocalDate startDate,
            LocalDate endDate
    );

    List<Purchase> findByBaseAndPurchaseDateBetween(
            Base base,
            LocalDate startDate,
            LocalDate endDate
    );
}