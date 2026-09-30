package com.mams.military_asset_management.dto;

public class DashboardResponse {

    private Integer openingBalance;
    private Integer purchases;
    private Integer transferIn;
    private Integer transferOut;
    private Integer netMovement;
    private Integer assigned;
    private Integer expended;
    private Integer closingBalance;

    public DashboardResponse() {
    }

    public DashboardResponse(
            Integer openingBalance,
            Integer purchases,
            Integer transferIn,
            Integer transferOut,
            Integer netMovement,
            Integer assigned,
            Integer expended,
            Integer closingBalance
    ) {
        this.openingBalance = openingBalance;
        this.purchases = purchases;
        this.transferIn = transferIn;
        this.transferOut = transferOut;
        this.netMovement = netMovement;
        this.assigned = assigned;
        this.expended = expended;
        this.closingBalance = closingBalance;
    }

    public Integer getOpeningBalance() {
        return openingBalance;
    }

    public Integer getPurchases() {
        return purchases;
    }

    public Integer getTransferIn() {
        return transferIn;
    }

    public Integer getTransferOut() {
        return transferOut;
    }

    public Integer getNetMovement() {
        return netMovement;
    }

    public Integer getAssigned() {
        return assigned;
    }

    public Integer getExpended() {
        return expended;
    }

    public Integer getClosingBalance() {
        return closingBalance;
    }

    public void setOpeningBalance(Integer openingBalance) {
        this.openingBalance = openingBalance;
    }

    public void setPurchases(Integer purchases) {
        this.purchases = purchases;
    }

    public void setTransferIn(Integer transferIn) {
        this.transferIn = transferIn;
    }

    public void setTransferOut(Integer transferOut) {
        this.transferOut = transferOut;
    }

    public void setNetMovement(Integer netMovement) {
        this.netMovement = netMovement;
    }

    public void setAssigned(Integer assigned) {
        this.assigned = assigned;
    }

    public void setExpended(Integer expended) {
        this.expended = expended;
    }

    public void setClosingBalance(Integer closingBalance) {
        this.closingBalance = closingBalance;
    }
}