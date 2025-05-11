package com.misogi.rentmate.api.service;

import com.misogi.rentmate.api.model.Role;
import com.misogi.rentmate.api.model.User;

public interface IContextService {

	User getCurrentUser();
	
	String getCurrentJwtToken();
	
	String getCurrentUserName();
	
	Role getCurrentUserRole();
	
}
