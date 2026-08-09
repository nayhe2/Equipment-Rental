package com.github.nayhe.equipmentrental.service;

import com.github.nayhe.equipmentrental.dto.UserLoginDto;
import com.github.nayhe.equipmentrental.dto.UserRegisterDto;
import com.github.nayhe.equipmentrental.entity.AppUser;
import com.github.nayhe.equipmentrental.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;
    private final CustomUserDetailsService customUserDetailsService;
    private final AuthenticationManager authenticationManager;

    public String registerUser(UserRegisterDto dto) {
        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("Username is already taken!");
        }

        AppUser newUser = new AppUser();
        newUser.setUsername(dto.getUsername());
        newUser.setPassword(passwordEncoder.encode(dto.getPassword()));
        newUser.setRole("ROLE_CUSTOMER");

        userRepository.save(newUser);

        return "User registered successfully!";
    }

    public String loginUser(UserLoginDto dto) {
        // Spring Security sprawdza, czy login i hasło pasują do siebie (jak nie, rzuci błędem)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword())
        );

        var user = customUserDetailsService.loadUserByUsername(dto.getUsername());

        return jwtService.generateToken(user);
    }
}