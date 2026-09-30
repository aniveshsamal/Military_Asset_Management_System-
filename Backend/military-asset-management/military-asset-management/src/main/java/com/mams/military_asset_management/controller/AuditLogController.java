package com.mams.military_asset_management.controller;

import com.mams.military_asset_management.dto.AuditLogResponse;
import com.mams.military_asset_management.entity.AuditLog;
import com.mams.military_asset_management.service.AuditLogService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(
            AuditLogService auditLogService
    ) {
        this.auditLogService = auditLogService;
    }

    @GetMapping
    public List<AuditLogResponse> getAllLogs() {

        return auditLogService.getAllLogs()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private AuditLogResponse toResponse(AuditLog log) {

        Long userId = null;
        String userName = null;

        if (log.getUser() != null) {
            userId = log.getUser().getId();
            userName = log.getUser().getName();
        }

        Long baseId = null;
        String baseName = null;

        if (log.getBase() != null) {
            baseId = log.getBase().getId();
            baseName = log.getBase().getName();
        }

        return new AuditLogResponse(
                log.getId(),
                userId,
                userName,
                log.getAction(),
                log.getEntityType(),
                log.getEntityId(),
                baseId,
                baseName,
                log.getStatus(),
                log.getDetails(),
                log.getTimestamp()
        );
    }
}