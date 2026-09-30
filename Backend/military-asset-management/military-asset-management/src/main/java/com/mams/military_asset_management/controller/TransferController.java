package com.mams.military_asset_management.controller;

import com.mams.military_asset_management.dto.TransferRequest;
import com.mams.military_asset_management.dto.TransferResponse;
import com.mams.military_asset_management.entity.Transfer;
import com.mams.military_asset_management.service.TransferService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

import java.util.List;

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
    public TransferResponse createTransfer(
            @Valid @RequestBody TransferRequest request
    ) {

        Transfer transfer =
                transferService.createTransfer(
                        request.getFromBaseId(),
                        request.getToBaseId(),
                        request.getEquipmentTypeId(),
                        request.getQuantity(),
                        request.getTransferDate(),
                        request.getReferenceNumber(),
                        request.getRemarks()
                );

        return toResponse(transfer);
    }

    @GetMapping
    public List<TransferResponse> getTransfers(
            @RequestParam(required = false) Long baseId,
            @RequestParam(required = false) Long equipmentTypeId,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate
    ) {

        return transferService.getTransfers(
                        baseId,
                        equipmentTypeId,
                        startDate,
                        endDate
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private TransferResponse toResponse(Transfer transfer) {

        return new TransferResponse(
                transfer.getId(),
                transfer.getFromBase().getId(),
                transfer.getFromBase().getName(),
                transfer.getToBase().getId(),
                transfer.getToBase().getName(),
                transfer.getEquipmentType().getId(),
                transfer.getEquipmentType().getName(),
                transfer.getQuantity(),
                transfer.getTransferDate(),
                transfer.getReferenceNumber(),
                transfer.getRemarks(),
                transfer.getCreatedBy().getName(),
                transfer.getCreatedAt()
        );
    }
}