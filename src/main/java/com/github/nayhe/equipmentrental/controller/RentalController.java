package com.github.nayhe.equipmentrental.controller;

import com.github.nayhe.equipmentrental.dto.RentalCreateDto;
import com.github.nayhe.equipmentrental.entity.Rental;
import com.github.nayhe.equipmentrental.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rental")
@RequiredArgsConstructor
public class RentalController {
    private final RentalService rentalService;

    @GetMapping
    public List<Rental> getAllRentals(){
        return rentalService.getAllRentals();
    }

    @PostMapping
    public Rental addRental(RentalCreateDto dto){
        return rentalService.createRental(dto);
    }
}
