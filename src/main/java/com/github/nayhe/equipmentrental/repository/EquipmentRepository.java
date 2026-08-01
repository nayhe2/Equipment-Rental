package com.github.nayhe.equipmentrental.repository;

import com.github.nayhe.equipmentrental.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EquipmentRepository extends JpaRepository<Equipment,Long> {

    // Spring widzi "IsAvailable" oraz "True" i sam pisze pod to SQL:
    // SELECT * FROM equipment WHERE is_available = true;
    List<Equipment> findAllByIsAvailableTrue();
}
