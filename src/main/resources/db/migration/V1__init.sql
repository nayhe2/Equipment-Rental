CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       role VARCHAR(50) NOT NULL
);

CREATE TABLE customers (
                          id BIGSERIAL PRIMARY KEY,
                          first_name VARCHAR(100) NOT NULL,
                          last_name VARCHAR(100) NOT NULL,
                          email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE equipment (
                           id BIGSERIAL PRIMARY KEY,
                           name VARCHAR(255) NOT NULL,
                           price_per_hour NUMERIC(10, 2) NOT NULL,
                           is_available BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE rental (
                        id BIGSERIAL PRIMARY KEY,
                        customer_id BIGINT NOT NULL,
                        equipment_id BIGINT NOT NULL,
                        start_date TIMESTAMP NOT NULL,
                        return_date TIMESTAMP,
                        total_cost NUMERIC(10, 2),

                        CONSTRAINT fk_rental_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
                        CONSTRAINT fk_rental_equipment FOREIGN KEY (equipment_id) REFERENCES equipment(id)
);