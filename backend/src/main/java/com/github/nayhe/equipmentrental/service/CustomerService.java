package com.github.nayhe.equipmentrental.service;

import com.github.nayhe.equipmentrental.dto.CustomerCreateDto;
import com.github.nayhe.equipmentrental.entity.Customer;
import com.github.nayhe.equipmentrental.exception.ResourceNotFoundException;
import com.github.nayhe.equipmentrental.mapper.CustomerMapper;
import com.github.nayhe.equipmentrental.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    public List<Customer> getAllCustomers() {
        return customerRepository.findAllByIsDeletedFalse();
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));
    }

    public Customer addCustomer(CustomerCreateDto dto) {
        Customer customer = customerMapper.toEntity(dto);
        customer.setIsDeleted(false);
        return customerRepository.save(customer);
    }

    public void deleteCustomerById(Long id) {
        Customer customer = getCustomerById(id); // rzuci 404, jeśli taki klient nie istnieje

        // "usunięcie" - klient znika z list, ale zostaje w bazie, żeby historia wypożyczeń dalej działała
        customer.setIsDeleted(true);
        customerRepository.save(customer);
    }
}