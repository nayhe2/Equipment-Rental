package com.github.nayhe.equipmentrental.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RentalCreateDto {
    private Long customerId;
    private Long equipmentId;
    private LocalDateTime dueDate;
}
