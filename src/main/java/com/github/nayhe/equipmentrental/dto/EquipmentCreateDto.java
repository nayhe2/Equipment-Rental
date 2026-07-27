package com.github.nayhe.equipmentrental.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class EquipmentCreateDto {
    private String name;
    private BigDecimal pricePerHour;
}
