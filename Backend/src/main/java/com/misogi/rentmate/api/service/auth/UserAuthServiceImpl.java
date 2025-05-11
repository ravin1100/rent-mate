package com.misogi.rentmate.api.service.auth;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.misogi.rentmate.api.dto.request.auth.LoginRequest;
import com.misogi.rentmate.api.dto.request.auth.SignUpRequest;
import com.misogi.rentmate.api.dto.response.UserResponse;
import com.misogi.rentmate.api.dto.response.user.JwtResponse;
import com.misogi.rentmate.api.exception.BadRequestException;
import com.misogi.rentmate.api.model.BlackListToken;
import com.misogi.rentmate.api.model.Role;
import com.misogi.rentmate.api.model.User;
import com.misogi.rentmate.api.repository.IBlackListTokenRepository;
import com.misogi.rentmate.api.repository.IUserRepository;
import com.misogi.rentmate.api.service.IContextService;
import com.misogi.rentmate.api.service.impl.OtpService;
import com.misogi.rentmate.api.utility.JwtTokenUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserAuthServiceImpl implements IUserAuthService{
	
	private final IUserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtTokenUtil jwtTokenUtil;
	private final IBlackListTokenRepository blackListTokenRepository;
	private final OtpService otpService;
	private final IContextService contextService;
	

	@Override
	public JwtResponse authenticate(LoginRequest request) throws BadRequestException {
		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new BadRequestException("Incorrect Email or Mobile Number"));
		
		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
		    throw new BadRequestException("Incorrect Password");
		}
		
		String role = user.getRole().name();
		String accessToken = jwtTokenUtil.generateToken(request.getEmail(), Map.ofEntries(Map.entry("role", role)));
		
		boolean isFirstLogin = user.isFirstLogin();
		if (isFirstLogin) {
            user.setFirstLogin(false);
            userRepository.save(user);
        }
		return new JwtResponse(user.getId(), user.getMobileNumber(), user.getEmail(), role, accessToken, isFirstLogin);
	
	}


	@Override
	public UserResponse register(SignUpRequest request) {
//		boolean isOtpValid = otpService.validateOtp(request.getEmail(), request.getOtp());

//		if (!isOtpValid) {
//			throw new IllegalArgumentException("Invalid or expired OTP");
//		}

		if (userRepository.existsByEmail(request.getEmail())) {
			throw new BadRequestException("User with this email already exists");
		}

		User user = new User();
		user.setFirstName(request.getFirstName());
		user.setLastName(request.getLastName());
		user.setEmail(request.getEmail());
		user.setCreatedAt(LocalDateTime.now());
		user.setRole(Role.ROLE_MEMBER);
//		user.setFirstLogin(false);
		user.setPassword(passwordEncoder.encode(request.getPassword()));

		User savedUser = userRepository.save(user);
		
		return UserResponse.builder()
				.id(savedUser.getId())
				.firstName(savedUser.getFirstName())
				.lastName(savedUser.getLastName())
				.email(savedUser.getEmail())
				.role(savedUser.getRole() == null ? null : savedUser.getRole())
				.firstLogin(savedUser.isFirstLogin())
				.householdId(savedUser.getHousehold() == null ? null : savedUser.getHousehold().getId()).build();
				
	}

	@Override
	public void logOut() {
		BlackListToken blackListToken = new BlackListToken();
		blackListToken.setToken(contextService.getCurrentJwtToken());
		blackListToken.setUserName(contextService.getCurrentUser().getEmail());
		blackListTokenRepository.save(blackListToken);
	}


	@Override
	public void otpRequestOnRegistration(String email) {
		otpService.sendSignUpOtp(email);
	}


	@Override
	public UserResponse authorizedUser() {
		User user = contextService.getCurrentUser();
		boolean isFirstLogin = user.isFirstLogin();
		if(user.getHousehold() == null) {
			isFirstLogin = true;
		}
		return UserResponse.builder()
				.id(user.getId())
				.firstName(user.getFirstName())
				.lastName(user.getLastName())
				.email(user.getEmail())
				.role(user.getRole() == null ? null : user.getRole())
				.firstLogin(isFirstLogin)
				.householdId(user.getHousehold() == null ? null : user.getHousehold().getId()).build();
	}

}
