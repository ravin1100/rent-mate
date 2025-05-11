package com.misogi.rentmate.api.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String firstName;
	
	private String lastName;
	
	@NotNull
	@Column(unique = true)
	@Email(message = "Invalid Email Format")
	private String email;
	
	private String mobileNumber;
	
	@NotNull
	private String password;
	
	@NotNull
	@Enumerated(EnumType.STRING)
	private Role role;
	
	private boolean firstLogin = true;
	
	@ManyToOne
	private Household household;

	private LocalDateTime createdAt;

	
}
