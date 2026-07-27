package com.github.nayhe.equipmentrental.service;

import com.github.nayhe.equipmentrental.dto.CustomerCreateDto;
import com.github.nayhe.equipmentrental.entity.Customer;
import com.github.nayhe.equipmentrental.exception.ResourceNotFoundException;
import com.github.nayhe.equipmentrental.mapper.CustomerMapper;
import com.github.nayhe.equipmentrental.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.util.CustomObjectInputStream;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {
    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    public CustomerService(CustomerRepository customerRepository, CustomerMapper customerMapper)
    {
        this.customerRepository = customerRepository;
        this.customerMapper = customerMapper;
    }

    public List<Customer> getAllCustomers()
    {
        return customerRepository.findAll();
    }

    public Customer getCustomerById(Long id){
        return customerRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Customer not found with ID: "+ id));
    }

    public Customer addCustomer(CustomerCreateDto dto)
    {
        Customer customer = customerMapper.toEntity(dto);
        return customerRepository.save(customer);
    }
}
