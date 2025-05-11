package com.misogi.rentmate.api.event;

import org.springframework.context.ApplicationEvent;

public class UserSignUpEvent extends ApplicationEvent{

	private static final long serialVersionUID = 1L;
	
	private String email;
	private String name;

	public UserSignUpEvent(Object source, String email, String name) {
		super(source);
		this.email = email;
		this.name = name;
	}

}
