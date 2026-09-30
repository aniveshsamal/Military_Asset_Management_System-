package com.mams.military_asset_management.repository;

import com.mams.military_asset_management.entity.Base;
import com.mams.military_asset_management.entity.EquipmentType;
import com.mams.military_asset_management.entity.Purchase;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {

        @Override
        @EntityGraph(attributePaths = {
                        "base",
                        "equipmentType",
                        "createdBy"
        })
        List<Purchase> findAll();

        @EntityGraph(attributePaths = {
                        "base",
                        "equipmentType",
                        "createdBy"
        })
        List<Purchase> findByBase(Base base);

        @EntityGraph(attributePaths = {
                        "base",
                        "equipmentType",
                        "createdBy"
        })
        List<Purchase> findByEquipmentType(EquipmentType equipmentType);

        @EntityGraph(attributePaths = {
                        "base",
                        "equipmentType",
                        "createdBy"
        })
        List<Purchase> findByPurchaseDateBetween(
                        LocalDate startDate,
                        LocalDate endDate);

        @EntityGraph(attributePaths = {
                        "base",
                        "equipmentType",
                        "createdBy"
        })
        List<Purchase> findByPurchaseDateAfter(LocalDate date);

        @EntityGraph(attributePaths = {
                        "base",
                        "equipmentType",
                        "createdBy"
        })
        List<Purchase> findByBaseAndPurchaseDateBetween(
                        Base base,
                        LocalDate startDate,
                        LocalDate endDate);

        @EntityGraph(attributePaths = {
                        "base",
                        "equipmentType",
                        "createdBy"
        })
        List<Purchase> findByBaseAndEquipmentTypeAndPurchaseDateBetween(
                        Base base,
                        EquipmentType equipmentType,
                        LocalDate startDate,
                        LocalDate endDate);

        @EntityGraph(attributePaths = {
                        "base",
                        "equipmentType",
                        "createdBy"
        })
        List<Purchase> findByEquipmentTypeAndPurchaseDateBetween(
                        EquipmentType equipmentType,
                        LocalDate startDate,
                        LocalDate endDate);

}