package com.misogi.rentmate.api.dto;

import java.util.List;

import lombok.Data;

@Data
public class SendInviteRequest {
	
	private List<String> emails;

}
