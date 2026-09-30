package com.mams.military_asset_management.dto;

import java.time.LocalDateTime;

public class AuditLogResponse {

    private Long id;

    private Long userId;
    private String userName;

    private String action;
    private String entityType;
    private Long entityId;

    private Long baseId;
    private String baseName;

    private String status;
    private String details;
    private LocalDateTime timestamp;

    public AuditLogResponse(
            Long id,
            Long userId,
            String userName,
            String action,
            String entityType,
            Long entityId,
            Long baseId,
            String baseName,
            String status,
            String details,
            LocalDateTime timestamp
    ) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.baseId = baseId;
        this.baseName = baseName;
        this.status = status;
        this.details = details;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }

    public String getAction() {
        return action;
    }

    public String getEntityType() {
        return entityType;
    }

    public Long getEntityId() {
        return entityId;
    }

    public Long getBaseId() {
        return baseId;
    }

    public String getBaseName() {
        return baseName;
    }

    public String getStatus() {
        return status;
    }

    public String getDetails() {
        return details;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}