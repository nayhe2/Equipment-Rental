package com.github.nayhe.equipmentrental.controller;

import com.github.nayhe.equipmentrental.dto.CustomerCreateDto;
import com.github.nayhe.equipmentrental.entity.Customer;
import com.github.nayhe.equipmentrental.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


// Dane klientów widoczne są tylko dla administratora
@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class CustomerController {
    private final CustomerService customerService;

    @GetMapping
    public List<Customer> getAllCustomers()
    {
        return customerService.getAllCustomers();
    }

    @GetMapping("/{id}")
    public Customer getCustomerById(@PathVariable Long id){
        return customerService.getCustomerById(id);
    }

    @PostMapping
    public Customer addCustomer(@Valid @RequestBody CustomerCreateDto dto)
    {
        return customerService.addCustomer(dto);
    }

}
