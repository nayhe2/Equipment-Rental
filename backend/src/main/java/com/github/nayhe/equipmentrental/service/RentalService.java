package com.github.nayhe.equipmentrental.service;

import com.github.nayhe.equipmentrental.dto.RentalCreateDto;
import com.github.nayhe.equipmentrental.entity.Customer;
import com.github.nayhe.equipmentrental.entity.Equipment;
import com.github.nayhe.equipmentrental.entity.Rental;
import com.github.nayhe.equipmentrental.exception.ResourceNotFoundException;
import com.github.nayhe.equipmentrental.repository.CustomerRepository;
import com.github.nayhe.equipmentrental.repository.EquipmentRepository;
import com.github.nayhe.equipmentrental.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RentalService {
    private final RentalRepository rentalRepository;
    private final CustomerRepository customerRepository;
    private final EquipmentRepository equipmentRepository;

    public List<Rental> getAllRentals() {
        return rentalRepository.findAll();
    }

    public Rental createRental(RentalCreateDto dto) {
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + dto.getCustomerId()));

        Equipment equipment = equipmentRepository.findById(dto.getEquipmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with ID: " + dto.getEquipmentId()));

        if (!equipment.getIsAvailable() || equipment.getIsDeleted()) {
            throw new RuntimeException("This equipment is currently unavailable");
        }
        equipment.setIsAvailable(false);
        equipmentRepository.save(equipment);

        Rental rental = new Rental();
        rental.setCustomer(customer);
        rental.setEquipment(equipment);
        rental.setStartDate(LocalDateTime.now());
        rental.setDueDate(dto.getDueDate());

        return rentalRepository.save(rental);
    }

    public Rental returnEquipment(Long rentalId) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new ResourceNotFoundException("Rental not found with ID: " + rentalId));

        if (rental.getReturnDate() != null)
            throw new RuntimeException("This equipment has already been returned");

        rental.setReturnDate(LocalDateTime.now());

        long hoursRented = ChronoUnit.HOURS.between(rental.getStartDate(), rental.getReturnDate());

        if (hoursRented == 0)
            hoursRented = 1;

        Equipment equipment = rental.getEquipment();

        BigDecimal cost = equipment.getPricePerHour().multiply(BigDecimal.valueOf(hoursRented));

        rental.setTotalCost(cost);
        equipment.setIsAvailable(true);
        equipmentRepository.save(equipment);

        return rentalRepository.save(rental);
    }

    public List<Rental> getRentalsByCustomer(Long customerId) {
        if (!customerRepository.existsById(customerId))
            throw new ResourceNotFoundException("Customer not found with ID: " + customerId);

        return rentalRepository.findAllByCustomer_Id(customerId);
    }

    public BigDecimal getTotalEarnings() {
        BigDecimal earnings = rentalRepository.calculateTotalEarnings();

        if (earnings == null) {
            return BigDecimal.ZERO;
        }

        return earnings;
    }

    public List<Object[]> getMonthlyEarnings(int year) {
        return rentalRepository.calculateMonthlyEarnings(year);
    }

    public List<Object[]> getYearlyEarnings() {
        return rentalRepository.calculateYearlyEarnings();
    }
}