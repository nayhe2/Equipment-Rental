package com.github.nayhe.equipmentrental;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@OpenAPIDefinition(
		info = @Info(title = "Equipment Rental API", version = "1.0"),
		security = @SecurityRequirement(name = "bearerAuth")
)
@SecurityScheme(
		name = "bearerAuth",
		type = SecuritySchemeType.HTTP,
		scheme = "bearer", // informuje Swaggera, żeby przyklejał słowo "Bearer "
		bearerFormat = "JWT"
)
@SpringBootApplication
@EnableScheduling
public class EquipmentRentalApplication {

	public static void main(String[] args) {
		SpringApplication.run(EquipmentRentalApplication.class, args);
	}

}
