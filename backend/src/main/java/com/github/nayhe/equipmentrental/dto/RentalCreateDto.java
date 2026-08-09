package com.github.nayhe.equipmentrental.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class RentalCreateDto {
    private Long customerId;
    private Long equipmentId;
}
