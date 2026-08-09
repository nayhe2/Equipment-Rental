package com.github.nayhe.equipmentrental.service;

import com.github.nayhe.equipmentrental.entity.Equipment;
import com.github.nayhe.equipmentrental.entity.Rental;
import com.github.nayhe.equipmentrental.repository.EquipmentRepository;
import com.github.nayhe.equipmentrental.repository.RentalRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

// Mówimy JUnitowi, żeby włączył obsługę "sztucznych" obiektów (Mocków)
@ExtendWith(MockitoExtension.class)
class RentalServiceTest {

    // 1. Tworzymy atrapę bazy danych (Mock)
    @Mock
    private RentalRepository rentalRepository;

    @Mock
    private EquipmentRepository equipmentRepository;

    // 2. Wstrzykujemy nasze atrapy do prawdziwego serwisu
    @InjectMocks
    private RentalService rentalService;

    // 3. Adnotacja @Test oznacza, że to jest metoda testowa
    @Test
    void shouldCalculateCorrectTotalCostWhenReturningEquipment() {
        // --- GIVEN (Zakładamy scenariusz) ---

        // Tworzymy sztuczny sprzęt (np. narty za 15 zł / godzinę)
        Equipment equipment = new Equipment();
        equipment.setId(1L);
        equipment.setPricePerHour(new BigDecimal("15"));
        equipment.setIsAvailable(false); // Jest obecnie wypożyczony

        // Tworzymy sztuczne wypożyczenie
        Rental rental = new Rental();
        rental.setId(100L);
        rental.setEquipment(equipment);
        // Cofa zegar o dokładnie 2 godziny w tył (klient miał sprzęt 2 godziny)
        rental.setStartDate(LocalDateTime.now().minusHours(2));

        // Mówimy atrapie bazy danych: "Jeśli ktoś zapyta o wypożyczenie nr 100, zwróć ten obiekt powyżej"
        when(rentalRepository.findById(100L)).thenReturn(Optional.of(rental));

        // --- WHEN (Wykonujemy akcję) ---

        // Odpalamy naszą PRAWDZIWĄ metodę, którą napisaliśmy wcześniej
        rentalService.returnEquipment(100L);

        // --- THEN (Sprawdzamy wyniki) ---

        // 1. Sprawdzamy czy sprzęt znów jest dostępny w magazynie
        assertTrue(rental.getEquipment().getIsAvailable());

        // 2. Sprawdzamy czy data zwrotu została wpisana
        assertNotNull(rental.getReturnDate());

        // 3. NAJWAŻNIEJSZE: 2 godziny * 15 zł = 30 zł. Sprawdzamy matematykę!
        // Używamy 0 (skala), bo nasze 15 zł nie miało miejsc po przecinku
        BigDecimal expectedCost = new BigDecimal("30");

        // Porównujemy wynik z naszej metody ze spodziewaną kwotą (używamy compareTo przy BigDecimal)
        assertEquals(0, expectedCost.compareTo(rental.getTotalCost()),
                "Koszt całkowity powinien wynosić równe 30 zł!");

        // 4. Upewniamy się, że serwis zapisał zmiany w atrapie bazy danych
        verify(rentalRepository, times(1)).save(rental);
    }
}