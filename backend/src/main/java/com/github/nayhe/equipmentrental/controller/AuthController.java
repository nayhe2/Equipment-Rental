package com.github.nayhe.equipmentrental.controller;

import com.github.nayhe.equipmentrental.dto.UserLoginDto;
import com.github.nayhe.equipmentrental.dto.UserRegisterDto;
import com.github.nayhe.equipmentrental.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public String register(@Valid @RequestBody UserRegisterDto dto) {
        return authService.registerUser(dto);
    }

    @PostMapping("/login")
    public String login(@RequestBody UserLoginDto dto){
        return authService.loginUser((dto));
    }
}