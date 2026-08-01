package com.github.nayhe.equipmentrental.service;

import com.github.nayhe.equipmentrental.dto.EquipmentCreateDto;
import com.github.nayhe.equipmentrental.entity.Equipment;
import com.github.nayhe.equipmentrental.mapper.EquipmentMapper;
import com.github.nayhe.equipmentrental.repository.EquipmentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.awt.image.RasterFormatException;
import java.util.List;

@Service
public class EquipmentService {
    private final EquipmentRepository equipmentRepository;
    private final EquipmentMapper equipmentMapper;

    public EquipmentService(EquipmentRepository equipmentRepository, EquipmentMapper equipmentMapper){
        this.equipmentRepository = equipmentRepository;
        this.equipmentMapper = equipmentMapper;
    }

    public Page<Equipment> getAllEquipment(Pageable pageable) {
        return equipmentRepository.findAll(pageable);
    }

    public Equipment getEquipmentById(Long id){
        return equipmentRepository.findById(id)
                .orElseThrow(()->new RasterFormatException(("Equipment not found with ID: "+ id)));
    }

    public Equipment addEquipment(EquipmentCreateDto dto){
        Equipment equipment = equipmentMapper.toEntity(dto);
        equipment.setIsAvailable(true);
        return equipmentRepository.save(equipment);
    }

    public List<Equipment> getAvailableEquipment(){
        return equipmentRepository.findAllByIsAvailableTrue();
    }
}


