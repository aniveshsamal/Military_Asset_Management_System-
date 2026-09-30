package com.mams.military_asset_management.config;

import com.mams.military_asset_management.entity.Role;
import com.mams.military_asset_management.entity.User;
import com.mams.military_asset_management.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.bootstrap-admin.name:}") String adminName,
            @Value("${app.bootstrap-admin.email:}") String adminEmail,
            @Value("${app.bootstrap-admin.password:}") String adminPassword) {

        return args -> {

            if (adminName.isBlank() || adminEmail.isBlank() || adminPassword.isBlank()) {
                return;
            }

            if (!userRepository.existsByEmail(adminEmail)) {

                User admin = new User();

                admin.setName(adminName);
                admin.setEmail(adminEmail);

                admin.setPassword(
                        passwordEncoder.encode(adminPassword));

                admin.setRole(Role.ADMIN);
                admin.setActive(true);

                userRepository.save(admin);

                System.out.println(
                        "Configured bootstrap administrator created: "
                                + adminEmail);
            }
        };
    }
}