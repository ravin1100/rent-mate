package com.misogi.rentmate.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.misogi.rentmate.api.model.Household;

public interface HouseholdRepository extends JpaRepository<Household, Long> {
	
	Household findByInviteCode(String inviteCode);
	
}
