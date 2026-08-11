package com.github.nayhe.equipmentrental.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "equipment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Boolean isAvailable;

    @Column(nullable = false)
    private BigDecimal pricePerHour;

    // sprzęt "usunięty" nie jest kasowany z bazy (żeby nie zgubić historii wypożyczeń),
    @Column(nullable = false)
    private Boolean isDeleted = false;
}