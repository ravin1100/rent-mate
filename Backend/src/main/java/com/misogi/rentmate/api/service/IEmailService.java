package com.misogi.rentmate.api.service;

public interface IEmailService {
	
	void sendEmailOnSignUp(String email, String otp) throws Exception;
	
	void sendEmailForPasswordReset(String email, String otp);
	
	void sendInviteEmail(String email, String inviteCode) throws Exception;

}
