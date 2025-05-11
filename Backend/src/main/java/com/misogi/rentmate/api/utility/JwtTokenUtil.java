package com.misogi.rentmate.api.utility;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.misogi.rentmate.api.model.Role;
import com.misogi.rentmate.api.service.auth.impl.CustomUserDetails;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenUtil {
	
	@Value("${app.jwt.expirationInMs}")
	private int jwtExpirationInMs;

	@Value("${app.jwt.secret}")
	private String jwtsecret;
	
	public String generateToken(String userName, Map<String, Object> map) {
		return doGenerateToken(userName, map);
	}
	
	private String doGenerateToken(String subject, Map<String, Object> claims) {
		return Jwts.builder().subject(subject).claims(claims).issuedAt(new Date(System.currentTimeMillis()))
				.expiration(new Date(System.currentTimeMillis() + jwtExpirationInMs  ))
				.signWith(getKey()).compact();
	}
	
	private Key getKey() {
		byte[] keyBytes = Decoders.BASE64.decode(jwtsecret);
		SecretKey key = Keys.hmacShaKeyFor(keyBytes);
		return key;
	}

	public String getUserNameFromToken(String token) {
		return getClaimFromToken(token, Claims::getSubject);
	}

	private <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
		final Claims claims = getAllClaimsFromToken(token);
		return claimsResolver.apply(claims);
	}

	private Claims getAllClaimsFromToken(String token) {
		return Jwts.parser().verifyWith((SecretKey)getKey()).build().parseSignedClaims(token).getPayload();
	}

	public Date getIssuedAtDateFromToken(String token) {
		return getClaimFromToken(token, Claims::getIssuedAt);
	}

	public Date getExpirationDateFromToken(String token) {
		return getClaimFromToken(token, Claims::getExpiration);
	}

	private Boolean isTokenExpired(String token) {
		final Date expiration = getExpirationDateFromToken(token);
		return expiration.before(new Date());
	}
	
	public Role getRoleFromJwtToken(String token) {
		Claims allClaimsFromToken = getAllClaimsFromToken(token);
		return Role.valueOf((String) allClaimsFromToken.get("ROLE"));
	}

	public boolean validateToken(String token, UserDetails userDetails) {
		final String username = getUserNameFromToken(token);
		var userDetail = (CustomUserDetails) userDetails;
		return (username.equals(userDetail.getUsername()) && !isTokenExpired(token));
	}
	
//	public String generateToken(UserDetails userDetails) {
//	CustomUserDetails userDetail = (CustomUserDetails)userDetails;
//	Map<String, Object> claims = new HashMap<>();
//
//	claims.put("Role", userDetail.getRole());
//	return Jwts.builder().subject(userDetails.getUsername()).claims(claims).issuedAt(new Date(System.currentTimeMillis()))
//			.expiration(new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000))
//			.signWith(getKey(jwtsecret)).compact();
//}
	
	
}
