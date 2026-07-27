package com.github.nayhe.equipmentrental.controller;

import com.github.nayhe.equipmentrental.dto.CustomerCreateDto;
import com.github.nayhe.equipmentrental.entity.Customer;
import com.github.nayhe.equipmentrental.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customerService;

    // dzieki @RequiredArgsConstructor nie musze tego robic
//    public CustomerController(CustomerService customerService)
//    {
//        this.customerService = customerService;
//    }

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
    public Customer addCustomer(@RequestBody CustomerCreateDto dto)
    {
        return customerService.addCustomer(dto);
    }

}
