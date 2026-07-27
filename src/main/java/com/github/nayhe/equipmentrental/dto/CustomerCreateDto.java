package com.github.nayhe.equipmentrental.dto;

import lombok.Data;

@Data
public class CustomerCreateDto {
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String idCardNumber;
}
