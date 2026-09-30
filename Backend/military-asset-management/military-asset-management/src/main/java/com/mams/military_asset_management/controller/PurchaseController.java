package com.mams.military_asset_management.controller;

import com.mams.military_asset_management.dto.PurchaseRequest;
import com.mams.military_asset_management.dto.PurchaseResponse;
import com.mams.military_asset_management.entity.Purchase;
import com.mams.military_asset_management.service.PurchaseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(
            PurchaseService purchaseService
    ) {
        this.purchaseService = purchaseService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PurchaseResponse createPurchase(
            @Valid @RequestBody PurchaseRequest request
    ) {

        Purchase purchase =
                purchaseService.createPurchase(
                        request.getBaseId(),
                        request.getEquipmentTypeId(),
                        request.getQuantity(),
                        request.getPurchaseDate(),
                        request.getSupplier(),
                        request.getInvoiceNumber(),
                        request.getRemarks()
                );

        return toResponse(purchase);
    }

    @GetMapping
    public List<PurchaseResponse> getPurchases(
            @RequestParam(required = false) Long baseId,
            @RequestParam(required = false) Long equipmentTypeId,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate
    ) {

        return purchaseService.getPurchases(
                        baseId,
                        equipmentTypeId,
                        startDate,
                        endDate
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private PurchaseResponse toResponse(Purchase purchase) {

        return new PurchaseResponse(
                purchase.getId(),
                purchase.getBase().getId(),
                purchase.getBase().getName(),
                purchase.getEquipmentType().getId(),
                purchase.getEquipmentType().getName(),
                purchase.getQuantity(),
                purchase.getPurchaseDate(),
                purchase.getSupplier(),
                purchase.getInvoiceNumber(),
                purchase.getRemarks(),
                purchase.getCreatedBy().getName(),
                purchase.getCreatedAt()
        );
    }
}