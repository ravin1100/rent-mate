package com.misogi.rentmate.api.service;

import com.misogi.rentmate.api.model.User;

public interface IChoreAssignment {

	void assignNextMember(Long choreId);
	User getCurrentAssignee(Long choreId);
	
}
