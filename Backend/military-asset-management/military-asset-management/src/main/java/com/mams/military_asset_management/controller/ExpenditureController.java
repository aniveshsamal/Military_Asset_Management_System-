package com.mams.military_asset_management.controller;

import com.mams.military_asset_management.dto.ExpenditureRequest;
import com.mams.military_asset_management.entity.Expenditure;
import com.mams.military_asset_management.service.ExpenditureService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

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
    public Expenditure createExpenditure(
            @Valid @RequestBody ExpenditureRequest request
    ) {

        return expenditureService.createExpenditure(
                request.getBaseId(),
                request.getEquipmentTypeId(),
                request.getQuantity(),
                request.getReason(),
                request.getExpenditureDate(),
                request.getReferenceNumber(),
                request.getPersonnelOrUnit(),
                request.getRemarks()
        );
    }
}