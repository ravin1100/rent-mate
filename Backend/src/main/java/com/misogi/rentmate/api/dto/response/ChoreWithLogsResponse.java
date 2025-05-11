package com.misogi.rentmate.api.dto.response;

import java.util.List;

import com.misogi.rentmate.api.model.Frequency;

import lombok.Data;

@Data
public class ChoreWithLogsResponse {
	
	private String choreName;
	private Frequency frequency;
	private List<ChoreLogResponse> logs;
	

}
