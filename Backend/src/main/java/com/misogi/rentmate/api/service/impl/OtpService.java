package com.misogi.rentmate.api.service.impl;

import java.security.SecureRandom;
import java.time.Duration;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.misogi.rentmate.api.service.IEmailService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OtpService {
	
	private final RedisTemplate<String, String> redisTemplate;
	
	private final IEmailService emailService;

	
	public void sendSignUpOtp(String email) {
		 String otp = this.generateOtp();
		 redisTemplate.opsForValue().set("SIGNUP_OTP_" + email, otp, Duration.ofMinutes(10));
		 try {
			emailService.sendEmailOnSignUp(email, otp);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public boolean validateOtp(String email, String submittedOtp) {
	    String key = "SIGNUP_OTP_" + email;
	    String storedOtp = redisTemplate.opsForValue().get(key);

	    if (storedOtp != null && storedOtp.equals(submittedOtp)) {
	        // Optional: Delete the OTP after successful validation
	        redisTemplate.delete(key);
	        return true;
	    }

	    return false;
	}
	
	private String generateOtp() {
		int otp = 100000 + new SecureRandom().nextInt(900000); // ensures 6 digits, no leading zeros
        return String.valueOf(otp);
	}
}
