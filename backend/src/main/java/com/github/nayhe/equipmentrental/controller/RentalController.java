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
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public List<Rental> getAllRentals() {
        return rentalService.getAllRentals();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public Rental addRental(@RequestBody RentalCreateDto dto) {
        return rentalService.createRental(dto);
    }

    @PostMapping("/{rentalId}/return")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public Rental returnEquipment(@PathVariable Long rentalId) {
        return rentalService.returnEquipment(rentalId);
    }

    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public List<Rental> getAllRentalsByCustomer(@PathVariable Long customerId) {
        return rentalService.getRentalsByCustomer(customerId);
    }

    @GetMapping("/earnings")
    @PreAuthorize("hasRole('ADMIN')")
    public BigDecimal getTotalEarnings() {
        return rentalService.getTotalEarnings();
    }

    @GetMapping("/earnings/monthly/{year}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public List<Object[]> getMonthlyEarnings(@PathVariable int year) {
        return rentalService.getMonthlyEarnings(year);
    }

    @GetMapping("/earnings/yearly")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public List<Object[]> getYearlyEarnings() {
        return rentalService.getYearlyEarnings();
    }
}