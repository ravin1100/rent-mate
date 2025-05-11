package com.misogi.rentmate.api.dto.request;

import lombok.Data;

@Data
public class HouseholdJoinRequest {
	
	private String inviteCode;
    private Long userId;
}
