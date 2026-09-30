package com.mams.military_asset_management.service;

import com.mams.military_asset_management.entity.Inventory;
import com.mams.military_asset_management.entity.Role;
import com.mams.military_asset_management.entity.User;
import com.mams.military_asset_management.repository.InventoryRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final CurrentUserService currentUserService;

    public InventoryService(
            InventoryRepository inventoryRepository,
            CurrentUserService currentUserService
    ) {
        this.inventoryRepository = inventoryRepository;
        this.currentUserService = currentUserService;
    }

    public List<Inventory> getInventory() {

        User user = currentUserService.getCurrentUser();

        if (user.getRole() == Role.ADMIN ||
                user.getRole() == Role.LOGISTICS_OFFICER) {

            return inventoryRepository.findAll();
        }

        if (user.getRole() == Role.BASE_COMMANDER) {

            if (user.getBase() == null) {
                throw new AccessDeniedException(
                        "Base commander is not assigned to a base"
                );
            }

            return inventoryRepository.findByBase(user.getBase());
        }

        throw new AccessDeniedException(
                "You are not authorized to view inventory"
        );
    }
}