package com.github.nayhe.equipmentrental.repository;

import com.github.nayhe.equipmentrental.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    List<Customer> findAllByIsDeletedFalse();
}