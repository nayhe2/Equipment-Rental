package com.github.nayhe.equipmentrental.service;

import com.github.nayhe.equipmentrental.dto.EquipmentCreateDto;
import com.github.nayhe.equipmentrental.entity.Equipment;
import com.github.nayhe.equipmentrental.exception.ResourceNotFoundException;
import com.github.nayhe.equipmentrental.mapper.EquipmentMapper;
import com.github.nayhe.equipmentrental.repository.EquipmentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipmentService {
    private final EquipmentRepository equipmentRepository;
    private final EquipmentMapper equipmentMapper;

    public EquipmentService(EquipmentRepository equipmentRepository, EquipmentMapper equipmentMapper) {
        this.equipmentRepository = equipmentRepository;
        this.equipmentMapper = equipmentMapper;
    }

    public Page<Equipment> getAllEquipment(Pageable pageable, String search) {
        if (search == null || search.isBlank()) {
            return equipmentRepository.findAllByIsDeletedFalse(pageable);
        }
        return equipmentRepository.findAllByIsDeletedFalseAndNameContainingIgnoreCase(search, pageable);
    }

    public Equipment getEquipmentById(Long id) {
        return equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with ID: " + id));
    }

    public Equipment addEquipment(EquipmentCreateDto dto) {
        Equipment equipment = equipmentMapper.toEntity(dto);
        equipment.setIsAvailable(true);
        equipment.setIsDeleted(false);
        return equipmentRepository.save(equipment);
    }

    public void deleteEquipment(Long id) {
        Equipment equipment = getEquipmentById(id);

        if (!equipment.getIsAvailable()) {
            throw new IllegalStateException("Cannot delete equipment that is currently rented");
        }

        //  "usunięcie" - sprzęt znika z list, ale zostaje w bazie, żeby historia wypożyczeń dalej działała
        equipment.setIsDeleted(true);
        equipmentRepository.save(equipment);
    }

    public List<Equipment> getAvailableEquipment() {
        return equipmentRepository.findAllByIsAvailableTrueAndIsDeletedFalse();
    }
}