package com.misogi.rentmate.api.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class OpenApiConfig {

	@Bean
	public OpenAPI customOpenAPI() {
		
		final String securitySchemeName = "bearerAuth";
		
		return new OpenAPI()
				.info(new Info().title("Personal Project")
						.version("v1.0")
						.description("Misogi AI Project")
//						.termsOfService("https://example.com/terms")
						.contact(new Contact()
								.name("Project Support Team")
								.email("support@example.com")
								.url("https://example.com/contact"))
//						.license(new License()
//								.name("Apache 2.0")
//								.url("https://www.apache.org/licenses/LICENSE-2.0.html")
//								)
						)
				 .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
			        .components(new Components()
			            .addSecuritySchemes(securitySchemeName,
			                new SecurityScheme()
			                    .name(securitySchemeName)
			                    .type(SecurityScheme.Type.HTTP)
			                    .scheme("bearer")
			                    .bearerFormat("JWT") // optional: describes the format
			            )
			        )
				.servers(List.of(
						new Server().url("http://localhost:8080").description("Local Dev Server"),
						new Server().url("https://project.example.com").description("Production Server")
						))
				.externalDocs(new ExternalDocumentation()
						.description("Misogi Project API Documentation")
						.url("https://docs.example.com/erp"));
	}

//	@Bean
//	public GroupedOpenApi publicApi() {
//		return GroupedOpenApi.builder()
//				.group("public-api")
//				.pathsToMatch("/api/public/**")
//				.build();
//	}
//
//	@Bean
//	public GroupedOpenApi adminApi() {
//		return GroupedOpenApi.builder()
//				.group("admin-api")
//				.pathsToMatch("/api/admin/**")
//				.build();
//	}
}
	

