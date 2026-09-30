package com.mams.military_asset_management.repository;

import com.mams.military_asset_management.entity.Base;
import com.mams.military_asset_management.entity.EquipmentType;
import com.mams.military_asset_management.entity.Transfer;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TransferRepository extends JpaRepository<Transfer, Long> {

        @Override
        @EntityGraph(attributePaths = {
                        "fromBase",
                        "toBase",
                        "equipmentType",
                        "createdBy"
        })
        List<Transfer> findAll();

        @EntityGraph(attributePaths = {
                        "fromBase",
                        "toBase",
                        "equipmentType",
                        "createdBy"
        })
        List<Transfer> findByFromBaseOrToBase(
                        Base fromBase,
                        Base toBase);

        @EntityGraph(attributePaths = {
                        "fromBase",
                        "toBase",
                        "equipmentType",
                        "createdBy"
        })
        List<Transfer> findByFromBase(Base fromBase);

        @EntityGraph(attributePaths = {
                        "fromBase",
                        "toBase",
                        "equipmentType",
                        "createdBy"
        })
        List<Transfer> findByToBase(Base toBase);

        @EntityGraph(attributePaths = {
                        "fromBase",
                        "toBase",
                        "equipmentType",
                        "createdBy"
        })
        List<Transfer> findByTransferDateBetween(
                        LocalDate startDate,
                        LocalDate endDate);

        @EntityGraph(attributePaths = {
                        "fromBase",
                        "toBase",
                        "equipmentType",
                        "createdBy"
        })
        List<Transfer> findByTransferDateAfter(LocalDate date);

        @EntityGraph(attributePaths = {
                        "fromBase",
                        "toBase",
                        "equipmentType",
                        "createdBy"
        })
        List<Transfer> findByFromBaseAndTransferDateBetween(
                        Base base,
                        LocalDate startDate,
                        LocalDate endDate);

        @EntityGraph(attributePaths = {
                        "fromBase",
                        "toBase",
                        "equipmentType",
                        "createdBy"
        })
        List<Transfer> findByToBaseAndTransferDateBetween(
                        Base base,
                        LocalDate startDate,
                        LocalDate endDate);

        @EntityGraph(attributePaths = {
                        "fromBase",
                        "toBase",
                        "equipmentType",
                        "createdBy"
        })
        List<Transfer> findByEquipmentTypeAndTransferDateBetween(
                        EquipmentType equipmentType,
                        LocalDate startDate,
                        LocalDate endDate);

        @Query("""
                        SELECT t
                        FROM Transfer t
                        WHERE (t.fromBase = :fromBase OR t.toBase = :toBase)
                        AND t.transferDate BETWEEN :startDate AND :endDate
                        """)
        @EntityGraph(attributePaths = {
                        "fromBase",
                        "toBase",
                        "equipmentType",
                        "createdBy"
        })
        List<Transfer> findByFromBaseOrToBaseAndTransferDate(
                        @Param("fromBase") Base fromBase,
                        @Param("toBase") Base toBase,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        @Query("""
                        SELECT t
                        FROM Transfer t
                        WHERE (t.fromBase = :base OR t.toBase = :base)
                        AND t.equipmentType = :equipmentType
                        AND t.transferDate BETWEEN :startDate AND :endDate
                        """)
        @EntityGraph(attributePaths = {
                        "fromBase",
                        "toBase",
                        "equipmentType",
                        "createdBy"
        })
        List<Transfer> findByBaseAndEquipmentTypeAndTransferDateBetween(
                        @Param("base") Base base,
                        @Param("equipmentType") EquipmentType equipmentType,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);
}
