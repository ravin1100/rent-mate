package com.misogi.rentmate.api.dto.response;

import com.misogi.rentmate.api.model.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {

	private Long id;
	private String firstName;
	private String lastName;
	private String email;
	private Role role;
	private boolean firstLogin;
	private Long householdId;
	
}
