package com.misogi.rentmate.api.service;

import java.util.List;

import com.misogi.rentmate.api.dto.request.ExpenseRequest;
import com.misogi.rentmate.api.dto.response.BalanceResponse;
import com.misogi.rentmate.api.dto.response.ExpenseResponse;

import jakarta.validation.Valid;

public interface IExpenseService {

	ExpenseResponse createExpense(ExpenseRequest request);

	List<ExpenseResponse> getExpenses(Long householdId, Long userId);

	ExpenseResponse getExpenseById(Long id);

	ExpenseResponse updateExpense(Long id, @Valid ExpenseRequest request);

	void deleteExpense(Long id);

	List<BalanceResponse>  getBalanceSummary();
	
}
