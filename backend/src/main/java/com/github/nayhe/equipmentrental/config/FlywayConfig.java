package com.github.nayhe.equipmentrental.config;

import org.flywaydb.core.Flyway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class FlywayConfig {

    private static final Logger log = LoggerFactory.getLogger(FlywayConfig.class);

    @Bean
    public Flyway flyway(DataSource dataSource) {
        log.info("Zmuszam Flywaya do ręcznego startu!");

        Flyway flyway = Flyway.configure()
                .dataSource(dataSource)
                .locations("classpath:db/migration")
                .baselineOnMigrate(true)
                .load();

        // Ta linijka to absolutny rozkaz - wykonaj pliki SQL z folderu!
        flyway.migrate();

        log.info("Flyway zakończył pracę!");
        return flyway;
    }
}