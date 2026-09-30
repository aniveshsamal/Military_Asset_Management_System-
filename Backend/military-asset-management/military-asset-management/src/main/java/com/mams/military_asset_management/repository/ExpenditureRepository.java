package com.mams.military_asset_management.repository;

import com.mams.military_asset_management.entity.Base;
import com.mams.military_asset_management.entity.EquipmentType;
import com.mams.military_asset_management.entity.Expenditure;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ExpenditureRepository
                extends JpaRepository<Expenditure, Long> {

        @Override
        @EntityGraph(attributePaths = {
                        "base",
                        "equipmentType",
                        "recordedBy"
        })
        List<Expenditure> findAll();

        @EntityGraph(attributePaths = {
                        "base",
                        "equipmentType",
                        "recordedBy"
        })
        List<Expenditure> findByBase(Base base);

        @EntityGraph(attributePaths = {
                        "base",
                        "equipmentType",
                        "recordedBy"
        })
        List<Expenditure> findByBaseAndExpenditureDateBetween(
                        Base base,
                        LocalDate startDate,
                        LocalDate endDate);

        @EntityGraph(attributePaths = {
                        "base",
                        "equipmentType",
                        "recordedBy"
        })
        List<Expenditure> findByEquipmentTypeAndExpenditureDateBetween(
                        EquipmentType equipmentType,
                        LocalDate startDate,
                        LocalDate endDate);

        @EntityGraph(attributePaths = {
                        "base",
                        "equipmentType",
                        "recordedBy"
        })
        List<Expenditure> findByExpenditureDateBetween(
                        LocalDate startDate,
                        LocalDate endDate);

        @EntityGraph(attributePaths = {
                        "base",
                        "equipmentType",
                        "recordedBy"
        })
        List<Expenditure> findByExpenditureDateAfter(LocalDate date);

        @Query("""
                        SELECT e
                        FROM Expenditure e
                        WHERE e.base = :base
                        AND e.equipmentType = :equipmentType
                        AND e.expenditureDate BETWEEN :startDate AND :endDate
                        """)
        @EntityGraph(attributePaths = {
                        "base",
                        "equipmentType",
                        "recordedBy"
        })
        List<Expenditure> findByBaseAndEquipmentTypeAndExpenditureDateBetween(
                        @Param("base") Base base,
                        @Param("equipmentType") EquipmentType equipmentType,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);
}