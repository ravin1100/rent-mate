package com.misogi.rentmate.api.config;

import java.io.IOException;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.misogi.rentmate.api.utility.JwtTokenUtil;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtRequestFilter extends OncePerRequestFilter{
	
	private final JwtTokenUtil jwtTokenUtil;
	
	private final UserDetailsService userDetailsService;
	
	private static final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class);

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
		
		final String authorizationHeader = request.getHeader("Authorization");
		
		try {
			
			String jwtToken = null;
			String username = null;
			
			if(authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
				
				jwtToken = authorizationHeader.substring(7);
				username = jwtTokenUtil.getUserNameFromToken(jwtToken);
				
				if(StringUtils.isNotBlank(username) && SecurityContextHolder.getContext().getAuthentication() == null) {
					
					UserDetails userDetails = userDetailsService.loadUserByUsername(username);
					
					if (jwtTokenUtil.validateToken(jwtToken, userDetails)) {
						
	                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
	                            userDetails,
	                            null,
	                            userDetails.getAuthorities()
	                    );
	                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
	                }
					
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		filterChain.doFilter(request, response);
		
	}

}
