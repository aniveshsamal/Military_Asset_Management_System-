package com.mams.military_asset_management.controller;

import com.mams.military_asset_management.dto.PurchaseRequest;
import com.mams.military_asset_management.entity.Purchase;
import com.mams.military_asset_management.service.PurchaseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Purchase createPurchase(
            @Valid @RequestBody PurchaseRequest request
    ) {

        return purchaseService.createPurchase(
                request.getBaseId(),
                request.getEquipmentTypeId(),
                request.getUserId(),
                request.getQuantity(),
                request.getPurchaseDate(),
                request.getSupplier(),
                request.getInvoiceNumber(),
                request.getRemarks()
        );
    }
}