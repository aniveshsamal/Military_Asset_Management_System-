package com.mams.military_asset_management.controller;

import com.mams.military_asset_management.dto.InventoryResponse;
import com.mams.military_asset_management.entity.Inventory;
import com.mams.military_asset_management.service.InventoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(
            InventoryService inventoryService
    ) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public List<InventoryResponse> getInventory() {

        return inventoryService.getInventory()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private InventoryResponse toResponse(Inventory inventory) {

        return new InventoryResponse(
                inventory.getId(),
                inventory.getBase().getId(),
                inventory.getBase().getName(),
                inventory.getEquipmentType().getId(),
                inventory.getEquipmentType().getName(),
                inventory.getQuantity(),
                inventory.getAssignedQuantity()
        );
    }
}