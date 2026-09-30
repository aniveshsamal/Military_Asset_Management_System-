package com.mams.military_asset_management.controller;

import com.mams.military_asset_management.entity.Base;
import com.mams.military_asset_management.entity.Role;
import com.mams.military_asset_management.entity.User;
import com.mams.military_asset_management.repository.BaseRepository;
import com.mams.military_asset_management.service.CurrentUserService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bases")
public class BaseController {

    private final BaseRepository baseRepository;
    private final CurrentUserService currentUserService;

    public BaseController(
            BaseRepository baseRepository,
            CurrentUserService currentUserService) {
        this.baseRepository = baseRepository;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<Base> getAllBases() {
        User user = currentUserService.getCurrentUser();

        if (user.getRole() == Role.BASE_COMMANDER) {
            if (user.getBase() == null) {
                throw new AccessDeniedException(
                        "Base commander is not assigned to a base");
            }

            Base assignedBase = baseRepository.findById(user.getBase().getId())
                    .orElseThrow(() -> new AccessDeniedException(
                            "Base Commander's assigned base could not be loaded"));
            return List.of(assignedBase);
        }

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