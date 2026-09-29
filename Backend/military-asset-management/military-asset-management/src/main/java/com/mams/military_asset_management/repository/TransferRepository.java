package com.mams.military_asset_management.repository;

import com.mams.military_asset_management.entity.Transfer;
import com.mams.military_asset_management.entity.Base;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransferRepository extends JpaRepository<Transfer, Long> {

    List<Transfer> findByFromBaseOrToBase(Base fromBase, Base toBase);

    List<Transfer> findByFromBase(Base fromBase);

    List<Transfer> findByToBase(Base toBase);
}