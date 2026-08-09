package com.github.nayhe.equipmentrental.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import org.springframework.web.bind.annotation.PostMapping;

import java.math.BigDecimal;

@Data
public class EquipmentCreateDto {

    @NotBlank(message = "Equipment name cannot be empty")
    private String name;

    @NotBlank(message = "Price per hour is required")
    @Positive(message = "Price per hour must be greater than zero")
    private BigDecimal pricePerHour;
}
