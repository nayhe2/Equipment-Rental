package com.github.nayhe.equipmentrental.mapper;


import com.github.nayhe.equipmentrental.dto.CustomerCreateDto;
import com.github.nayhe.equipmentrental.entity.Customer;
import org.mapstruct.Mapper;

// Dzięki temu "componentModel = "spring"" - MapStruct wygeneruje ten plik w taki sposób, że
// Spring potraktuje go jak zwykły @Service i pozwoli nam go łatwo "wstrzyknąć" przez konstruktor.
@Mapper(componentModel = "spring")
public interface CustomerMapper {
    Customer toEntity(CustomerCreateDto dto);
}
