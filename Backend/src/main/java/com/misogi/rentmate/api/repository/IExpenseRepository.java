package com.misogi.rentmate.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.misogi.rentmate.api.model.Expense;
import com.misogi.rentmate.api.model.Household;

public interface IExpenseRepository extends JpaRepository<Expense, Long>{
	
	List<Expense> findAllByHousehold(Household househole);

}
