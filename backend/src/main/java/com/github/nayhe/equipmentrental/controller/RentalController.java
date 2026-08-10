package com.github.nayhe.equipmentrental.controller;

import com.github.nayhe.equipmentrental.dto.RentalCreateDto;
import com.github.nayhe.equipmentrental.entity.Rental;
import com.github.nayhe.equipmentrental.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
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
    @PreAuthorize("hasRole('ADMIN')")
    public Rental addRental(@RequestBody RentalCreateDto dto){
        return rentalService.createRental(dto);
    }

    @PostMapping("/{rentalId}/return")
    @PreAuthorize("hasRole('ADMIN')")
    public Rental returnEquipmemt(@PathVariable Long rentalId){
        return rentalService.returnEquipment(rentalId);
    }

    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Rental> getAllRentalsByCustomer(@PathVariable Long customerId){
        return rentalService.getRentalsByCustomer(customerId);
    }

    @GetMapping("/earnings")
    @PreAuthorize("hasRole('ADMIN')")
    public BigDecimal getTotalEarnings() {
        return rentalService.getTotalEarnings();
    }
}
