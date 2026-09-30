package com.mams.military_asset_management.controller;

import com.mams.military_asset_management.dto.ExpenditureRequest;
import com.mams.military_asset_management.dto.ExpenditureResponse;
import com.mams.military_asset_management.entity.Expenditure;
import com.mams.military_asset_management.service.ExpenditureService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenditures")
public class ExpenditureController {

    private final ExpenditureService expenditureService;

    public ExpenditureController(
            ExpenditureService expenditureService
    ) {
        this.expenditureService = expenditureService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExpenditureResponse createExpenditure(
            @Valid @RequestBody ExpenditureRequest request
    ) {
        Expenditure expenditure =
                expenditureService.createExpenditure(
                        request.getBaseId(),
                        request.getEquipmentTypeId(),
                        request.getQuantity(),
                        request.getReason(),
                        request.getExpenditureDate(),
                        request.getReferenceNumber(),
                        request.getPersonnelOrUnit(),
                        request.getRemarks()
                );

        return toResponse(expenditure);
    }

    @GetMapping
    public List<ExpenditureResponse> getExpenditures(
            @RequestParam(required = false) Long baseId,
            @RequestParam(required = false) Long equipmentTypeId,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate
    ) {
        return expenditureService
                .getExpenditures(
                        baseId,
                        equipmentTypeId,
                        startDate,
                        endDate
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private ExpenditureResponse toResponse(
            Expenditure expenditure
    ) {
        return new ExpenditureResponse(
                expenditure.getId(),
                expenditure.getBase().getId(),
                expenditure.getBase().getName(),
                expenditure.getEquipmentType().getId(),
                expenditure.getEquipmentType().getName(),
                expenditure.getQuantity(),
                expenditure.getReason(),
                expenditure.getExpenditureDate(),
                expenditure.getReferenceNumber(),
                expenditure.getPersonnelOrUnit(),
                expenditure.getRemarks(),
                expenditure.getRecordedBy().getName(),
                expenditure.getCreatedAt()
        );
    }
}