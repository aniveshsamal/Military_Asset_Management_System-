package com.mams.military_asset_management.dto;

public class MovementDetailsResponse {

    private long purchases;
    private long transferIn;
    private long transferOut;
    private long netMovement;

    public MovementDetailsResponse(
            long purchases,
            long transferIn,
            long transferOut
    ) {
        this.purchases = purchases;
        this.transferIn = transferIn;
        this.transferOut = transferOut;
        this.netMovement =
                purchases + transferIn - transferOut;
    }

    public long getPurchases() {
        return purchases;
    }

    public long getTransferIn() {
        return transferIn;
    }

    public long getTransferOut() {
        return transferOut;
    }

    public long getNetMovement() {
        return netMovement;
    }
}