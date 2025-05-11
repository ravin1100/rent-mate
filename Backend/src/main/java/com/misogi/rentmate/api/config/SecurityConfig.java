package com.misogi.rentmate.api.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
	
	private final JwtAuthenticationEntryPoint authenticationEntryPoint;
	private final JwtRequestFilter jwtRequestFilter;
	
	
	private static final String[] WHITE_LIST_URLS = {
			
			"/v3/api-docs/**",
            "/swagger-ui/**",
            "/api/users/register/**",
            "/api/users/login"
	};

	
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
		httpSecurity.csrf(csrf -> csrf.disable())
		.cors(cors -> cors.configurationSource(request -> {
					CorsConfiguration configuration = new CorsConfiguration();
//						configuration.setAllowCredentials(Boolean.TRUE);
						configuration.setAllowedHeaders(List.of("*"));
						configuration.setAllowedMethods(List.of("*"));
						configuration.setAllowedOrigins(List.of("*"));
						configuration.setMaxAge(3600L);
						return configuration;
				}))
				.authorizeHttpRequests(request -> request.requestMatchers(WHITE_LIST_URLS).permitAll()
						.anyRequest().authenticated())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.exceptionHandling(ex -> ex.authenticationEntryPoint(authenticationEntryPoint))
				.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
		
				return httpSecurity.build();
	}

    @Bean
    PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
}
