package com.misogi.rentmate.api.service.impl;

import org.apache.commons.lang3.StringUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.misogi.rentmate.api.model.Role;
import com.misogi.rentmate.api.model.User;
import com.misogi.rentmate.api.repository.IUserRepository;
import com.misogi.rentmate.api.service.IContextService;
import com.misogi.rentmate.api.service.auth.impl.CustomUserDetails;
import com.misogi.rentmate.api.utility.JwtTokenUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContextServieImpl implements IContextService {
	
	private final IUserRepository userRepository;
	private final JwtTokenUtil jwtTokenUtil;

	@Override
	public User getCurrentUser() {
		String currentUserName = this.getCurrentUserName();
		return userRepository.findByEmail(currentUserName).orElse(null);
	}

	@Override
	public String getCurrentJwtToken() {
		String token = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest().getHeader("Authorization");
	    if (token == null) return null;
	    return StringUtils.substring(token, 7);
	}

	@Override
	public String getCurrentUserName() {
		
		String userName = "";
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if(principal instanceof CustomUserDetails) {
			userName =  ((CustomUserDetails)principal).getUsername();
		}
		else {
			userName = principal.toString();
		}
		return userName;
	}

	@Override
	public Role getCurrentUserRole() {
		String currentJwt = getCurrentJwtToken();
        if (StringUtils.isBlank(currentJwt)) return null;
        return jwtTokenUtil.getRoleFromJwtToken(currentJwt);
	}

}
