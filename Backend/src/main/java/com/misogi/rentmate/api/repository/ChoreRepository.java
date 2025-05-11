package com.misogi.rentmate.api.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.misogi.rentmate.api.model.Chore;
import com.misogi.rentmate.api.model.Household;

public interface ChoreRepository extends JpaRepository<Chore, Long> {
	
	List<Chore> findAllByHouseholdId(Long householdId);
	
	List<Chore> findByCurrentlyAssignedToIdIn(List<Long> userIds);
	
	List<Chore> findByHouseholdAndNextDueDateLessThanEqual(Household household, LocalDate toDate);
	
}
