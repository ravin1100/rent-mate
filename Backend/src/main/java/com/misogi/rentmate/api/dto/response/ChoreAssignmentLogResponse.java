package com.misogi.rentmate.api.dto.response;

import lombok.Data;

@Data
public class ChoreAssignmentLogResponse {

	private Long id;
	private String choreName;
	private String assignedToName;
	private String assignedToEmail;
	private String assignedOn;
	private String completedOn;
	
}
