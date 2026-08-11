package com.github.nayhe.equipmentrental.repository;

import com.github.nayhe.equipmentrental.entity.Equipment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    // tylko dostępny i nieusunięty sprzęt (np. do formularza wypożyczenia)
    List<Equipment> findAllByIsAvailableTrueAndIsDeletedFalse();

    // lista sprzętu (bez usuniętego) z paginacją
    Page<Equipment> findAllByIsDeletedFalse(Pageable pageable);

    // wyszukiwanie po nazwie (bez usuniętego), z paginacją
    Page<Equipment> findAllByIsDeletedFalseAndNameContainingIgnoreCase(String name, Pageable pageable);
}