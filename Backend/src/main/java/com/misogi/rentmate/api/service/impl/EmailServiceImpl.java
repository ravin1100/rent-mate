package com.misogi.rentmate.api.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.misogi.rentmate.api.service.IEmailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements IEmailService{
	
	private final JavaMailSender mailSender;
	
	@Value("${spring.mail.username}")
	private String senderEmail;

	@Override
	public void sendEmailOnSignUp(String email, String otp) throws Exception {
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true);
//		InternetAddress internetAddress = new InternetAddress(senderEmail, firstName + "" + LastName);
		helper.setFrom(senderEmail);
		helper.setSubject("User Sign Up OTP Request");
//		helper.setTo(internetAddress);
		helper.setTo(email);
		helper.setText(this.getSignUpHtml(otp), true);
		mailSender.send(message);
	}

	@Override
	public void sendEmailForPasswordReset(String email, String otp) {
		
	}
	
	private String getSignUpHtml(String otp) {
		return String.format(
				"""
			<!DOCTYPE html>
				<html>
					<head>
					  <meta charset="UTF-8" />
					  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
					  <title>OTP Verification</title>
					  <style>
					    body {
					      margin: 0;
					      padding: 0;
					      background-color: #f4f4f7;
					      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
					    }
					    .container {
					      max-width: 600px;
					      margin: 40px auto;
					      background-color: #ffffff;
					      border-radius: 8px;
					      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
					      overflow: hidden;
					    }
					    .header {
					      background-color: #4a90e2;
					      color: #ffffff;
					      text-align: center;
					      padding: 30px 20px;
					    }
					    .header h1 {
					      margin: 0;
					      font-size: 24px;
					    }
					    .body {
					      padding: 30px 20px;
					      text-align: center;
					    }
					    .body h2 {
					      color: #333333;
					    }
					    .otp-box {
					      font-size: 32px;
					      font-weight: bold;
					      color: #4a90e2;
					      letter-spacing: 6px;
					      margin: 20px 0;
					      background-color: #f0f4ff;
					      display: inline-block;
					      padding: 15px 25px;
					      border-radius: 6px;
					    }
					    .footer {
					      padding: 20px;
					      font-size: 12px;
					      color: #888888;
					      text-align: center;
					    }
					    .footer a {
					      color: #4a90e2;
					      text-decoration: none;
					    }
					    @media (max-width: 600px) {
					      .otp-box {
					        font-size: 26px;
					        padding: 12px 20px;
					      }
					    }
					  </style>
					</head>
					<body>
					  <div class="container">
					    <div class="header">
					      <h1>Verify Your Email</h1>
					    </div>
					    <div class="body">
					      <h2>Welcome to [Your App Name]!</h2>
					      <p>Use the OTP below to verify your email address and complete your signup:</p>
					      <div class="otp-box">%s</div>
					      <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
					    </div>
					    <div class="footer">
					      <p>If you didn't sign up for [Your App Name], you can safely ignore this email.</p>
					      <p>&copy; 2025 [Your App Name]. All rights reserved.</p>
					    </div>
					  </div>
					</body>
				</html>

									""",
				otp);
	}

	@Override
	public void sendInviteEmail(String email, String inviteCode) throws Exception {
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true);
		helper.setFrom(senderEmail);
		helper.setSubject("Join Household Invitation");
		helper.setTo(email);
		helper.setText(this.getInviteEmail(inviteCode), true);
		mailSender.send(message);
	}
	
	private String getInviteEmail(String inviteCode) {
		return String.format(
				"""
														<!DOCTYPE html>
						<html lang="en">
						<head>
						    <meta charset="UTF-8">
						    <meta http-equiv="X-UA-Compatible" content="IE=edge">
						    <meta name="viewport" content="width=device-width, initial-scale=1.0">
						    <title>Household Invitation</title>
						    <style>
						        body {
						            font-family: 'Arial', sans-serif;
						            margin: 0;
						            padding: 0;
						            background-color: #f8f9fa;
						        }
						        .email-container {
						            max-width: 600px;
						            margin: 50px auto;
						            background-color: #ffffff;
						            border-radius: 8px;
						            overflow: hidden;
						            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
						        }
						        .header {
						            background-color: #4CAF50;
						            color: white;
						            padding: 20px;
						            text-align: center;
						        }
						        .content {
						            padding: 20px;
						            color: #333333;
						        }
						        .cta-button {
						            display: inline-block;
						            padding: 10px 20px;
						            margin-top: 20px;
						            background-color: #4CAF50;
						            color: white;
						            text-decoration: none;
						            border-radius: 4px;
						            font-size: 16px;
						        }
						        .cta-button:hover {
						            background-color: #45a049;
						        }
						        .footer {
						            text-align: center;
						            padding: 20px;
						            background-color: #f8f9fa;
						            color: #6c757d;
						            font-size: 12px;
						        }
						    </style>
						</head>
						<body>

						<div class="email-container">
						    <!-- Header -->
						    <div class="header">
						        <h2>You're Invited!</h2>
						    </div>

						    <!-- Content -->
						    <div class="content">
						        <p>Hi [Recipient Name],</p>

						        <p>We are excited to invite you to join our household on the <strong>[Household Name]</strong> platform!</p>

						        <p>To join the household, simply use the following invite code:</p>

						        <div style="font-size: 20px; font-weight: bold; color: #4CAF50;">%s</div>

						        <p>Use this code to complete your registration and join us!</p>
						    </div>

						    <!-- Footer -->
						    <div class="footer">
						        <p>If you did not request this invitation, please disregard this email.</p>
						    </div>
						</div>

						</body>
						</html>


									""",
				inviteCode);
	}

}
