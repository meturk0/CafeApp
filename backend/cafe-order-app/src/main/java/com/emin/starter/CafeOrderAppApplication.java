package com.emin.starter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.emin")

@EnableJpaRepositories("com.emin.repository")
@EntityScan("com.emin.entities")

public class CafeOrderAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(CafeOrderAppApplication.class, args);
	}

}
