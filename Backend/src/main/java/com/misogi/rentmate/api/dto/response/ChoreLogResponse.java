package com.misogi.rentmate.api.dto.response;

import lombok.Data;

@Data
public class ChoreLogResponse {
	
	private Long id;
	private String completedAt;
	private String completedByEmai;
	private String completedByName;

}
