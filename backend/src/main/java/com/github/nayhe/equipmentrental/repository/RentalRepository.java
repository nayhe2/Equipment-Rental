package com.github.nayhe.equipmentrental.repository;

import com.github.nayhe.equipmentrental.entity.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface RentalRepository extends JpaRepository<Rental, Long> {
    List<Rental> findAllByCustomer_Id(Long customerId);

    @Query("SELECT SUM(r.totalCost) FROM Rental r WHERE r.totalCost IS NOT NULL")
    BigDecimal calculateTotalEarnings();

    List<Rental> findAllByReturnDateIsNull();

    @Query("SELECT MONTH(r.returnDate), SUM(r.totalCost) FROM Rental r " +
            "WHERE r.totalCost IS NOT NULL AND YEAR(r.returnDate) = :year " +
            "GROUP BY MONTH(r.returnDate) ORDER BY MONTH(r.returnDate)")
    List<Object[]> calculateMonthlyEarnings(int year);

    @Query("SELECT YEAR(r.returnDate), SUM(r.totalCost) FROM Rental r " +
            "WHERE r.totalCost IS NOT NULL " +
            "GROUP BY YEAR(r.returnDate) ORDER BY YEAR(r.returnDate)")
    List<Object[]> calculateYearlyEarnings();
}