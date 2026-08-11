package com.github.nayhe.equipmentrental.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import org.springframework.web.bind.annotation.PostMapping;

import java.math.BigDecimal;

@Data
public class EquipmentCreateDto {

    @NotBlank(message = "Equipment name cannot be empty")
    private String name;

    @NotNull
    @DecimalMin(value = "0.00", inclusive = false)
    private BigDecimal pricePerHour;
}
