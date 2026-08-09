package com.github.nayhe.equipmentrental.controller;

import com.github.nayhe.equipmentrental.dto.EquipmentCreateDto;
import com.github.nayhe.equipmentrental.entity.Equipment;
import com.github.nayhe.equipmentrental.service.EquipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.awt.*;
import java.util.List;

@RestController
@RequestMapping("/api/equipment")
@RequiredArgsConstructor
public class EquipmentController {

    final EquipmentService equipmentService;

    @GetMapping
    public Page<Equipment> getAllEquipment(Pageable pageable){
        return equipmentService.getAllEquipment(pageable);
    }

    @GetMapping("/{id}")
    public Equipment getEquipmentById(@PathVariable Long id) // @PathVariable zeby Spring nie szukal id w ciele zapytania tylko URL
    {
        return equipmentService.getEquipmentById(id);
    }

    @PostMapping
    public Equipment addEquipment(@Valid @RequestBody EquipmentCreateDto dto){
        return equipmentService.addEquipment((dto));
    }

    @GetMapping("/available")
    public List<Equipment> getAvailableEquipment(){
        return equipmentService.getAvailableEquipment();
    }
}
