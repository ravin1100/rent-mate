package com.misogi.rentmate.api.service;

import java.util.List;

import com.misogi.rentmate.api.dto.request.HouseholdRequest;
import com.misogi.rentmate.api.dto.response.HouseholdResponse;
import com.misogi.rentmate.api.model.User;

public interface IHouseholdService {

	void createHousehold(HouseholdRequest request);

	void joinHousehold(String inviteCode);

	List<User> getHouseholdMembers(Long householdId);
	
	HouseholdResponse getHousehold();

	void sendInviteToEmails(List<String> emails);

	
}
