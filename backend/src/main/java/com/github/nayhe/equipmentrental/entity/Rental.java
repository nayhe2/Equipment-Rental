package com.github.nayhe.equipmentrental.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "rental")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rental {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //  wiele wypożyczeń może należeć do jednego klienta.
    //  wiele wpisów o wypożyczeniu może dotyczyć jednego sprzętu (to będzie historia wypożyczeń).
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    @Column
    private LocalDateTime startDate;

    // opcjonalny planowany termin zwrotu — może być null, jeśli admin go nie ustawi
    @Column
    private LocalDateTime dueDate;

    @Column
    private LocalDateTime returnDate;

    @Column
    private BigDecimal totalCost;
}
