package com.mams.military_asset_management.controller;

import com.mams.military_asset_management.dto.DashboardResponse;
import com.mams.military_asset_management.dto.MovementDetailsResponse;
import com.mams.military_asset_management.service.DashboardService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(
            DashboardService dashboardService
    ) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public DashboardResponse getDashboard(

            @RequestParam(required = false)
            Long baseId,

            @RequestParam(required = false)
            Long equipmentTypeId,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate
    ) {

        return dashboardService.getDashboard(
                baseId,
                equipmentTypeId,
                startDate,
                endDate
        );
    }
    @GetMapping("/movement-details")
    public MovementDetailsResponse getMovementDetails(
            @RequestParam(required = false) Long baseId,
            @RequestParam(required = false) Long equipmentTypeId,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate
    ) {
        return dashboardService.getMovementDetails(
                baseId,
                equipmentTypeId,
                startDate,
                endDate
        );
    }
}