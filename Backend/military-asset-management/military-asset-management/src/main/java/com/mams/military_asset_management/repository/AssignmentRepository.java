package com.mams.military_asset_management.repository;

import com.mams.military_asset_management.entity.Assignment;
import com.mams.military_asset_management.entity.Base;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    List<Assignment> findByBase(Base base);

    List<Assignment> findByBaseAndStatus(Base base, String status);
}