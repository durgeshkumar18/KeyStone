package com.keystone.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

        @Autowired
        private JwtAuthenticationFilter jwtAuthenticationFilter;

        @Autowired
        private CustomUserDetailsService customUserDetailsService;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Bean
        public DaoAuthenticationProvider authenticationProvider() {

                DaoAuthenticationProvider provider = new DaoAuthenticationProvider(customUserDetailsService);

                provider.setPasswordEncoder(passwordEncoder);

                return provider;
        }

        @Bean
        public AuthenticationManager authenticationManager(
                        AuthenticationConfiguration configuration)
                        throws Exception {

                return configuration.getAuthenticationManager();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {

                CorsConfiguration configuration = new CorsConfiguration();

                configuration.setAllowedOrigins(
                                List.of("http://localhost:5173"));

                configuration.setAllowedMethods(
                                List.of(
                                                "GET",
                                                "POST",
                                                "PUT",
                                                "DELETE",
                                                "OPTIONS"));

                configuration.setAllowedHeaders(
                                List.of(
                                                "Authorization",
                                                "Content-Type",
                                                "Accept"));

                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration(
                                "/**",
                                configuration);

                return source;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(
                        HttpSecurity http)
                        throws Exception {

                http

                                // Disable CSRF for JWT REST API
                                .csrf(csrf -> csrf.disable())

                                // Enable CORS
                                .cors(cors -> {
                                })

                                // Stateless JWT authentication
                                .sessionManagement(session -> session.sessionCreationPolicy(
                                                SessionCreationPolicy.STATELESS))

                                .authorizeHttpRequests(auth -> auth

                                                // ====================================================
                                                // PUBLIC
                                                // ====================================================

                                                .requestMatchers(
                                                                "/api/auth/login",
                                                                "/api/auth/register")
                                                .permitAll()

                                                .requestMatchers("/error")
                                                .permitAll()

                                                .requestMatchers(
                                                                HttpMethod.OPTIONS,
                                                                "/**")
                                                .permitAll()

                                                // ====================================================
                                                // ADMIN
                                                // ====================================================

                                                .requestMatchers(
                                                                "/api/users/**")
                                                .hasRole("ADMIN")

                                                // ====================================================
                                                // DASHBOARD
                                                // ====================================================

                                                .requestMatchers(
                                                                "/api/dashboard")
                                                .hasAnyRole(
                                                                "ADMIN",
                                                                "DISPATCHER")

                                                // ====================================================
                                                // CUSTOMERS
                                                // ====================================================

                                                .requestMatchers(
                                                                "/api/customers/**")
                                                .hasAnyRole(
                                                                "ADMIN",
                                                                "DISPATCHER")

                                                // ====================================================
                                                // TECHNICIANS
                                                // ====================================================

                                                .requestMatchers(
                                                                "/api/technicians/**")
                                                .hasAnyRole(
                                                                "ADMIN",
                                                                "DISPATCHER")

                                                // ====================================================
                                                // SERVICE REQUESTS
                                                // ====================================================

                                                .requestMatchers(
                                                                "/api/service-requests/**")
                                                .hasAnyRole(
                                                                "ADMIN",
                                                                "DISPATCHER",
                                                                "TECHNICIAN")

                                                // ====================================================
                                                // WORK ORDERS
                                                // ====================================================

                                                .requestMatchers(
                                                                "/api/workorders/**")
                                                .hasAnyRole(
                                                                "ADMIN",
                                                                "DISPATCHER",
                                                                "TECHNICIAN")

                                                // ====================================================
                                                // PROFILE
                                                // ====================================================

                                                .requestMatchers(
                                                                "/api/profile")
                                                .authenticated()

                                                // ====================================================
                                                // EVERYTHING ELSE
                                                // ====================================================

                                                .anyRequest().authenticated())

                                .authenticationProvider(
                                                authenticationProvider())

                                // JWT filter BEFORE username/password filter
                                .addFilterBefore(
                                                jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}