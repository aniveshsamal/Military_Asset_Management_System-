package com.mams.military_asset_management.service;

import com.mams.military_asset_management.entity.Base;
import com.mams.military_asset_management.entity.Role;
import com.mams.military_asset_management.entity.User;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationService {

    public void checkBaseAccess(User user, Base base) {

        if (user.getRole() == Role.ADMIN) {
            return;
        }

        if (user.getRole() == Role.BASE_COMMANDER) {

            if (user.getBase() == null) {
                throw new AccessDeniedException(
                        "Base commander is not assigned to a base"
                );
            }

            if (!user.getBase().getId().equals(base.getId())) {
                throw new AccessDeniedException(
                        "You are not authorized to access this base"
                );
            }

            return;
        }

        throw new AccessDeniedException(
                "You are not authorized to perform this operation"
        );
    }

    public void checkTransferAccess(
            User user,
            Base fromBase,
            Base toBase
    ) {

        if (user.getRole() == Role.ADMIN) {
            return;
        }

        if (user.getRole() == Role.LOGISTICS_OFFICER) {
            return;
        }

        if (user.getRole() == Role.BASE_COMMANDER) {

            if (user.getBase() == null) {
                throw new AccessDeniedException(
                        "Base commander is not assigned to a base"
                );
            }

            Long assignedBaseId = user.getBase().getId();

            if (!assignedBaseId.equals(fromBase.getId()) &&
                    !assignedBaseId.equals(toBase.getId())) {

                throw new AccessDeniedException(
                        "You are not authorized for this transfer"
                );
            }

            return;
        }

        throw new AccessDeniedException(
                "You are not authorized to perform this operation"
        );
    }
}