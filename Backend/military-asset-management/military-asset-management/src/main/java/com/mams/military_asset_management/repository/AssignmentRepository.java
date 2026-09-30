package com.mams.military_asset_management.repository;

import com.mams.military_asset_management.entity.Assignment;
import com.mams.military_asset_management.entity.Base;
import com.mams.military_asset_management.entity.EquipmentType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AssignmentRepository
        extends JpaRepository<Assignment, Long> {

    @Override
    @EntityGraph(attributePaths = {
            "base",
            "equipmentType",
            "assignedBy"
    })
    List<Assignment> findAll();

    @EntityGraph(attributePaths = {
            "base",
            "equipmentType",
            "assignedBy"
    })
    List<Assignment> findByBase(Base base);

    @EntityGraph(attributePaths = {
            "base",
            "equipmentType",
            "assignedBy"
    })
    List<Assignment> findByAssignmentDateBetween(
            LocalDate startDate,
            LocalDate endDate
    );

    @EntityGraph(attributePaths = {
            "base",
            "equipmentType",
            "assignedBy"
    })
    List<Assignment> findByBaseAndAssignmentDateBetween(
            Base base,
            LocalDate startDate,
            LocalDate endDate
    );

    @EntityGraph(attributePaths = {
            "base",
            "equipmentType",
            "assignedBy"
    })
    List<Assignment> findByEquipmentTypeAndAssignmentDateBetween(
            EquipmentType equipmentType,
            LocalDate startDate,
            LocalDate endDate
    );

    @Query("""
        SELECT a
        FROM Assignment a
        WHERE a.base = :base
        AND a.equipmentType = :equipmentType
        AND a.assignmentDate BETWEEN :startDate AND :endDate
        """)
    @EntityGraph(attributePaths = {
            "base",
            "equipmentType",
            "assignedBy"
    })
    List<Assignment> findByBaseAndEquipmentTypeAndAssignmentDateBetween(
            @Param("base") Base base,
            @Param("equipmentType") EquipmentType equipmentType,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}