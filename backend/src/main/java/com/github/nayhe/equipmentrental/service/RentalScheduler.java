package com.github.nayhe.equipmentrental.service;

import com.github.nayhe.equipmentrental.entity.Rental;
import com.github.nayhe.equipmentrental.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j // Ta adnotacja z Lomboka pozwala na ładne logowanie do konsoli (zamiast System.out.println)
public class RentalScheduler {

    private final RentalRepository rentalRepository;

    // Do testów odpalamy co 10 000 milisekund (10 sekund).
    // W prawdziwym życiu używamy CRONa, co pokażę poniżej.
    @Scheduled(fixedRate = 10000)
    public void checkUnreturnedEquipment() {
        log.info("Rozpoczynam sprawdzanie przeterminowanych wypożyczeń...");

        List<Rental> activeRentals = rentalRepository.findAllByReturnDateIsNull();

        if (activeRentals.isEmpty()) {
            log.info("Wszystkie sprzęty zostały zwrócone. Magazyn jest pełny!");
            return;
        }

        log.warn("Znaleziono {} aktywnych wypożyczeń!", activeRentals.size());

        for (Rental rental : activeRentals) {
            log.info("UWAGA: Klient ID: {} wciąż przetrzymuje sprzęt ID: {}. Wypożyczono: {}",
                    rental.getCustomer().getId(),
                    rental.getEquipment().getId(),
                    rental.getStartDate());

            // TODO: logika wysyłania e-maili
        }
    }
}