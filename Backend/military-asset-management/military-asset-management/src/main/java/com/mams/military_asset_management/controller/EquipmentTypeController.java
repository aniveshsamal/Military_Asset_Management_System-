package com.mams.military_asset_management.controller;

import com.mams.military_asset_management.entity.EquipmentType;
import com.mams.military_asset_management.repository.EquipmentTypeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipment-types")
public class EquipmentTypeController {

    private final EquipmentTypeRepository equipmentTypeRepository;

    public EquipmentTypeController(
            EquipmentTypeRepository equipmentTypeRepository
    ) {
        this.equipmentTypeRepository = equipmentTypeRepository;
    }

    @GetMapping
    public List<EquipmentType> getAllEquipmentTypes() {
        return equipmentTypeRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EquipmentType createEquipmentType(
            @RequestBody EquipmentType equipmentType
    ) {

        if (equipmentType.getName() == null ||
                equipmentType.getName().isBlank()) {

            throw new IllegalArgumentException(
                    "Equipment type name is required"
            );
        }

        if (equipmentTypeRepository
                .findByName(equipmentType.getName())
                .isPresent()) {

            throw new IllegalArgumentException(
                    "Equipment type already exists"
            );
        }

        return equipmentTypeRepository.save(equipmentType);
    }
}