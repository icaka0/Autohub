package softuni.autohubbackend.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import softuni.autohubbackend.model.vehicleAd.entity.AdStatus;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleAdDTO {

    private UUID id;

    @Valid
    @NotNull(message = "Vehicle details are required")
    private VehicleDTO vehicle;

    private UserSummaryDTO seller;

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 100, message = "Title must be between 5 and 100 characters")
    private String title;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero")
    private BigDecimal price;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private AdStatus status;

    @Builder.Default
    private List<String> imageUrls = new ArrayList<>();

    @NotBlank(message = "Location is required")
    private String location;

    private String contactPhone;

    private Integer viewCount;
}