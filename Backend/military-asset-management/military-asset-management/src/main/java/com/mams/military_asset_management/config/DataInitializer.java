package com.mams.military_asset_management.config;

import com.mams.military_asset_management.entity.Role;
import com.mams.military_asset_management.entity.User;
import com.mams.military_asset_management.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {

        return args -> {

            String adminEmail = "admin@mams.com";

            if (!userRepository.existsByEmail(adminEmail)) {

                User admin = new User();

                admin.setName("System Administrator");
                admin.setEmail(adminEmail);

                admin.setPassword(
                        passwordEncoder.encode("Admin@123")
                );

                admin.setRole(Role.ADMIN);
                admin.setActive(true);

                userRepository.save(admin);

                System.out.println(
                        "Default admin user created: "
                                + adminEmail
                );
            }
        };
    }
}