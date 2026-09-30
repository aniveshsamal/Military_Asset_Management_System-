package com.mams.military_asset_management.config;

import com.mams.military_asset_management.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        public SecurityConfig(
                        JwtAuthenticationFilter jwtAuthenticationFilter) {
                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public AuthenticationManager authenticationManager(
                        AuthenticationConfiguration configuration) throws Exception {
                return configuration.getAuthenticationManager();
        }

        @Bean
        public SecurityFilterChain securityFilterChain(
                        HttpSecurity http) throws Exception {

                http
                                .csrf(csrf -> csrf.disable())

                                .cors(cors -> {
                                })

                                .sessionManagement(session -> session.sessionCreationPolicy(
                                                SessionCreationPolicy.STATELESS))

                                .authorizeHttpRequests(auth -> auth

                                                // Authentication
                                                .requestMatchers("/api/auth/**")
                                                .permitAll()

                                                // Authenticated user's own profile
                                                .requestMatchers("/api/profile/**")
                                                .authenticated()

                                                // Users - Admin only
                                                .requestMatchers("/api/users/**")
                                                .hasRole("ADMIN")

                                                // Audit logs - Admin only
                                                .requestMatchers("/api/audit-logs/**")
                                                .hasRole("ADMIN")

                                                // Bases
                                                .requestMatchers(HttpMethod.GET, "/api/bases/**")
                                                .hasAnyRole(
                                                                "ADMIN",
                                                                "BASE_COMMANDER",
                                                                "LOGISTICS_OFFICER")

                                                .requestMatchers(HttpMethod.POST, "/api/bases/**")
                                                .hasRole("ADMIN")

                                                // Equipment types
                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/equipment-types/**")
                                                .hasAnyRole(
                                                                "ADMIN",
                                                                "BASE_COMMANDER",
                                                                "LOGISTICS_OFFICER")

                                                .requestMatchers(
                                                                HttpMethod.POST,
                                                                "/api/equipment-types/**")
                                                .hasRole("ADMIN")

                                                // Purchases
                                                .requestMatchers(
                                                                "/api/purchases/**")
                                                .hasAnyRole(
                                                                "ADMIN",
                                                                "BASE_COMMANDER",
                                                                "LOGISTICS_OFFICER")

                                                // Transfers
                                                .requestMatchers(
                                                                "/api/transfers/**")
                                                .hasAnyRole(
                                                                "ADMIN",
                                                                "BASE_COMMANDER",
                                                                "LOGISTICS_OFFICER")

                                                // Assignments
                                                .requestMatchers(
                                                                "/api/assignments/**")
                                                .hasAnyRole(
                                                                "ADMIN",
                                                                "BASE_COMMANDER")

                                                // Expenditures
                                                .requestMatchers(
                                                                "/api/expenditures/**")
                                                .hasAnyRole(
                                                                "ADMIN",
                                                                "BASE_COMMANDER")

                                                // Inventory
                                                .requestMatchers(
                                                                "/api/inventory/**")
                                                .hasAnyRole(
                                                                "ADMIN",
                                                                "BASE_COMMANDER")

                                                // Dashboard
                                                .requestMatchers(
                                                                "/api/dashboard/**")
                                                .hasAnyRole(
                                                                "ADMIN",
                                                                "BASE_COMMANDER")

                                                // Everything else
                                                .anyRequest().authenticated())

                                .addFilterBefore(
                                                jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}