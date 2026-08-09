package com.github.nayhe.equipmentrental.mapper;

import com.github.nayhe.equipmentrental.entity.Rental;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RentalMapper {
    Rental toEnity(RentalMapper dto);
}
