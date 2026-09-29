package com.mams.military_asset_management.controller;

import com.mams.military_asset_management.entity.Base;
import com.mams.military_asset_management.repository.BaseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bases")
public class BaseController {

    private final BaseRepository baseRepository;

    public BaseController(BaseRepository baseRepository) {
        this.baseRepository = baseRepository;
    }

    @GetMapping
    public List<Base> getAllBases() {
        return baseRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Base createBase(@RequestBody Base base) {

        if (base.getName() == null || base.getName().isBlank()) {
            throw new IllegalArgumentException("Base name is required");
        }

        if (base.getCode() == null || base.getCode().isBlank()) {
            throw new IllegalArgumentException("Base code is required");
        }

        if (baseRepository.findByCode(base.getCode()).isPresent()) {
            throw new IllegalArgumentException("Base code already exists");
        }

        return baseRepository.save(base);
    }
}