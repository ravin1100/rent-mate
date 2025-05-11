package com.misogi.rentmate.api.dto.request;

import java.util.List;

import lombok.Data;

@Data
public class ChoreRequest {
	
	private String name;
    private String frequency; // DAILY, WEEKLY, MONTHLY
    private Long householdId;
    private List<Long> allowedMemebers;

}
