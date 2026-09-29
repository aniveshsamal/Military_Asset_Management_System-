package com.mams.military_asset_management.controller;

import com.mams.military_asset_management.dto.TransferRequest;
import com.mams.military_asset_management.entity.Transfer;
import com.mams.military_asset_management.service.TransferService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transfers")
public class TransferController {

    private final TransferService transferService;

    public TransferController(
            TransferService transferService
    ) {
        this.transferService = transferService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Transfer createTransfer(
            @Valid @RequestBody TransferRequest request
    ) {

        return transferService.createTransfer(
                request.getFromBaseId(),
                request.getToBaseId(),
                request.getEquipmentTypeId(),
                request.getQuantity(),
                request.getTransferDate(),
                request.getReferenceNumber(),
                request.getRemarks()
        );
    }
}