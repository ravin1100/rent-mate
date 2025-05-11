package com.misogi.rentmate.api.service.auth.impl;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.misogi.rentmate.api.model.User;

import lombok.Data;


@Data
public class CustomUserDetails implements UserDetails {

	private static final long serialVersionUID = 1L;
	
	private Long id;
	
	private String email;
	
	private String mobileNumber;
	
	@JsonIgnore
	private String password;
	
	private Collection<? extends GrantedAuthority> authorities;
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}
	@Override
	public String getUsername() {
		return email;
	}
	
	public CustomUserDetails(Long id, String email, String mobileNumber, String password, Collection<? extends GrantedAuthority> authorities) {
		this.id = id;
		this.email = email;
		this.mobileNumber = mobileNumber;
		this.password = password;
		this.authorities = authorities;
	}
	
	public static CustomUserDetails build(User user) {
		List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(user.getRole().name()));
		CustomUserDetails customUserDetails = new CustomUserDetails(user.getId(), user.getEmail(), user.getMobileNumber(), user.getPassword(), authorities);
		return customUserDetails;
	}
	


}
