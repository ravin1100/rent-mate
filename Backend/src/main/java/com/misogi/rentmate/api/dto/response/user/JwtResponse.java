package com.misogi.rentmate.api.dto.response.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class JwtResponse{
	
	private Long userId;
	private String mobileNumber;
	private String email;
//	private boolean isEmailVerified;
//	private boolean isMobileNumberVerified;
	private String role;
	private String accessToken;
	private boolean firstLogin;
	
}
		
		
		

