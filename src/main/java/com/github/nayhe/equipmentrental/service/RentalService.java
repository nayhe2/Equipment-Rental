package com.github.nayhe.equipmentrental.service;

import com.github.nayhe.equipmentrental.dto.RentalCreateDto;
import com.github.nayhe.equipmentrental.entity.Customer;
import com.github.nayhe.equipmentrental.entity.Equipment;
import com.github.nayhe.equipmentrental.entity.Rental;
import com.github.nayhe.equipmentrental.exception.ResourceNotFoundException;
import com.github.nayhe.equipmentrental.mapper.RentalMapper;
import com.github.nayhe.equipmentrental.repository.CustomerRepository;
import com.github.nayhe.equipmentrental.repository.EquipmentRepository;
import com.github.nayhe.equipmentrental.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RentalService {
    private final RentalRepository rentalRepository;
    private final CustomerRepository customerRepository;
    private final EquipmentRepository equipmentRepository;

    public List<Rental> getAllRentals(){
        return rentalRepository.findAll();
    }

    public Rental createRental(RentalCreateDto dto){
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + dto.getCustomerId()));

        Equipment equipment = equipmentRepository.findById(dto.getEquipmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with ID: " + dto.getEquipmentId()));

        if(!equipment.getIsAvailable()) {
            throw new RuntimeException("This equipment is currently unavailable");
        }
        equipment.setIsAvailable(true);
        equipmentRepository.save(equipment);

        Rental rental = new Rental();
        rental.setCustomer(customer);
        rental.setEquipment(equipment);
        rental.setStartDate(LocalDate.now());

        return rentalRepository.save(rental);
    }

}

