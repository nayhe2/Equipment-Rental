package com.github.nayhe.equipmentrental.repository;

import com.github.nayhe.equipmentrental.entity.Rental;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RentalRepository extends JpaRepository<Rental,Long> {
}
