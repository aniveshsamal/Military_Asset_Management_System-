package com.mams.military_asset_management.repository;



import com.mams.military_asset_management.entity.Base;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BaseRepository extends JpaRepository<Base, Long> {

    Optional<Base> findByCode(String code);
}
