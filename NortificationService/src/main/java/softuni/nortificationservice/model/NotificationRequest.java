package softuni.nortificationservice.model;

public class NotificationRequest {
    private Long userId;
    private Long vehicleAdId;
    private String vehicleTitle;
    private Double oldPrice;
    private Double newPrice;

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getVehicleAdId() {
        return vehicleAdId;
    }

    public void setVehicleAdId(Long vehicleAdId) {
        this.vehicleAdId = vehicleAdId;
    }

    public String getVehicleTitle() {
        return vehicleTitle;
    }

    public void setVehicleTitle(String vehicleTitle) {
        this.vehicleTitle = vehicleTitle;
    }

    public Double getOldPrice() {
        return oldPrice;
    }

    public void setOldPrice(Double oldPrice) {
        this.oldPrice = oldPrice;
    }

    public Double getNewPrice() {
        return newPrice;
    }

    public void setNewPrice(Double newPrice) {
        this.newPrice = newPrice;
    }
}
