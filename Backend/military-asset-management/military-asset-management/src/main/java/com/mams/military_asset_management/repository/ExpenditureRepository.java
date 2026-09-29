package com.mams.military_asset_management.repository;

import com.mams.military_asset_management.entity.Expenditure;
import com.mams.military_asset_management.entity.Base;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenditureRepository extends JpaRepository<Expenditure, Long> {

    List<Expenditure> findByBase(Base base);
}