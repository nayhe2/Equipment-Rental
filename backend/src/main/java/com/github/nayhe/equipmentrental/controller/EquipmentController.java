package com.github.nayhe.equipmentrental.controller;

import com.github.nayhe.equipmentrental.dto.EquipmentCreateDto;
import com.github.nayhe.equipmentrental.entity.Equipment;
import com.github.nayhe.equipmentrental.service.EquipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipment")
@RequiredArgsConstructor
public class EquipmentController {

    final EquipmentService equipmentService;

    @GetMapping
    public Page<Equipment> getAllEquipment(Pageable pageable, @RequestParam(required = false) String search) {
        return equipmentService.getAllEquipment(pageable, search);
    }

    @GetMapping("/{id}")
    public Equipment getEquipmentById(@PathVariable Long id) {
        return equipmentService.getEquipmentById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public Equipment addEquipment(@Valid @RequestBody EquipmentCreateDto dto) {
        return equipmentService.addEquipment(dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<Void> deleteEquipment(@PathVariable Long id) {
        equipmentService.deleteEquipment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/available")
    public List<Equipment> getAvailableEquipment() {
        return equipmentService.getAvailableEquipment();
    }
}