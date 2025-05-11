package com.misogi.rentmate.api.service.auth;

import org.apache.coyote.BadRequestException;

import com.misogi.rentmate.api.dto.request.auth.LoginRequest;
import com.misogi.rentmate.api.dto.request.auth.SignUpRequest;
import com.misogi.rentmate.api.dto.response.UserResponse;
import com.misogi.rentmate.api.dto.response.user.JwtResponse;



public interface IUserAuthService {
	
	UserResponse register(SignUpRequest request);

	JwtResponse authenticate(LoginRequest request) throws BadRequestException;

	void logOut();

	void otpRequestOnRegistration(String email);

	UserResponse authorizedUser();
	
}
