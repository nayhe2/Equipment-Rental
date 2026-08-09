package com.github.nayhe.equipmentrental.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name="rental")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rental {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//  Wiele wypożyczeń może należeć do jednego klienta.
//  Wiele wpisów o wypożyczeniu może dotyczyć jednego sprzętu (to będzie nasza historia wypożyczeń).
    @ManyToOne
    @JoinColumn(name="customer_id", nullable = false)
    private Customer customer;

    @ManyToOne
    @JoinColumn(name="equipment_id", nullable = false)
    private Equipment equipment;

    @Column
    private LocalDateTime startDate;

    @Column
    private LocalDateTime returnDate;

    @Column
    private BigDecimal totalCost;
}
