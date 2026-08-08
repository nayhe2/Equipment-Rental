package com.github.nayhe.equipmentrental.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    // Przechowuje rolę, np. "ROLE_ADMIN" lub "ROLE_STAFF"
    @Column(nullable = false)
    private String role;
}