package com.mark.conduyt.config;


import com.mark.conduyt.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    @Order(1)
    public SecurityFilterChain publicFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .securityMatcher(
                        "/**"
                )
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }

//    @Order(2)
//    public SecurityFilterChain protectedFilterChain(HttpSecurity http) throws Exception {
//        // Handler required for React/SPA to work with CSRF
//        CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
//        requestHandler.setCsrfRequestAttributeName(null);
//
//        http
//                // 1. MATCHERS: Specify the URLs handled by this chain
//                .securityMatcher("/api/employees/**", "/api/leads/**", "/api/orders/**") // Assuming orders are also protected
//
//                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
//
//                // 2. CSRF IS ENABLED HERE
//                .csrf(csrf -> csrf
//                        .csrfTokenRequestHandler(requestHandler)
//                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
//                )
//
//                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//
//                // 3. AUTHORIZATION: Define granular access rules
//                .authorizeHttpRequests(auth -> auth
//
//                        // --- EXCEPTION RULE (Highest Priority) ---
//                        // POST /api/employees/add: RESTRICTED to ADMIN only.
//                        .requestMatchers(HttpMethod.POST, "/api/employees/add").hasAuthority("ADMIN")
//
//                        // --- GENERIC RULE (Applies to everything else in the matched paths) ---
//                        // All other endpoints under /employees/**, /leads/**, /orders/**
//                        // require either EMPLOYEE or ADMIN authority.
//                        .requestMatchers("/api/employees/**", "/api/leads/**", "/api/orders/**","api/**")
//                        .hasAnyAuthority("EMPLOYEE", "ADMIN")
//
//                        // Fallback: Any other request that matched this chain must be authenticated (safe measure)
//                        .anyRequest().authenticated()
//                )
//
//                // 4. Add JWT Filter ONLY to this chain
//                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true); // Essential for Cookies
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}