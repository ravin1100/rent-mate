package com.misogi.rentmate.api.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.misogi.rentmate.api.model.Expense;
import com.misogi.rentmate.api.model.Household;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
	
	List<Expense> findByHouseholdAndAddedAtBetween(Household household, LocalDateTime from, LocalDateTime to);
	
}
