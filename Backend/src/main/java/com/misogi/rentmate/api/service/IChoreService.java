package com.misogi.rentmate.api.service;

import java.util.List;

import com.misogi.rentmate.api.dto.request.ChoreRequest;
import com.misogi.rentmate.api.dto.response.ChoreAssignmentLogResponse;
import com.misogi.rentmate.api.dto.response.ChoreResponse;

public interface IChoreService {

	void createChore(ChoreRequest choreRequest);
	
	List<ChoreResponse> getHouseholdAllChores(List<Long> userIds);
	
	void markChoreDone(Long choreId, Long userId);
	
	List<ChoreAssignmentLogResponse> getLogsForChore(Long choreId, Long userId);
	
}
