package com.misogi.rentmate.api.controller.auth;

import java.util.Map;

import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.misogi.rentmate.api.dto.request.auth.LoginRequest;
import com.misogi.rentmate.api.dto.request.auth.SignUpRequest;
import com.misogi.rentmate.api.dto.response.UserResponse;
import com.misogi.rentmate.api.dto.response.user.JwtResponse;
import com.misogi.rentmate.api.service.auth.IUserAuthService;

import lombok.RequiredArgsConstructor;

@RestController
@Validated
@RequiredArgsConstructor
@RequestMapping(value = "/api/users")
public class UserAuthController {
	
	private final IUserAuthService userAuthService;
	
//	@PostMapping(value = "/register/otp-request")
//	public ResponseEntity<?> otpRequestOnRegistration(@RequestParam String email) throws BadRequestException{
//		userAuthService.otpRequestOnRegistration(email);
//		return ResponseEntity.ok(Map.ofEntries(Map.entry("message", "OTP sent on email")));
//	}
	
	@PostMapping(value = "/register")
	public ResponseEntity<?> registerUser(@RequestBody SignUpRequest request) throws BadRequestException{
		return ResponseEntity.ok(userAuthService.register(request));
	}

	@PostMapping(value = "/login")
	public ResponseEntity<JwtResponse> authenticateUser(@RequestBody LoginRequest request) throws BadRequestException{
		return ResponseEntity.ok(userAuthService.authenticate(request));
	}
	
	@GetMapping(value = "/authorized-user")
	public ResponseEntity<UserResponse> authorizedUser(){
		return ResponseEntity.ok(userAuthService.authorizedUser());
	}
	
	@PostMapping(value = "/logout")
	public ResponseEntity<?> authenticateUser(){
		userAuthService.logOut();
		return ResponseEntity.ok(Map.ofEntries(Map.entry("message", "Logout Successfully")));
	}
	
	
	
	
	
}
