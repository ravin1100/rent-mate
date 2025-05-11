package com.misogi.rentmate.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.misogi.rentmate.api.dto.request.ExpenseRequest;
import com.misogi.rentmate.api.dto.response.BalanceResponse;
import com.misogi.rentmate.api.dto.response.ExpenseResponse;
import com.misogi.rentmate.api.service.IExpenseService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/expenses")
public class ExpenseController {
	
	private final IExpenseService expenseService;
	
	@PostMapping("/add")
	public ResponseEntity<ExpenseResponse> createExpense(@RequestBody ExpenseRequest request) {
	    return ResponseEntity.ok().body(expenseService.createExpense(request));
	}
	
    @GetMapping("/get-all")
    public ResponseEntity<List<ExpenseResponse>> getExpenses(
            @RequestParam(required = false) Long householdId,
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(expenseService.getExpenses(householdId, userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponse> getExpenseById(@PathVariable Long id) {
        return ResponseEntity.ok(expenseService.getExpenseById(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(@PathVariable Long id, @RequestBody @Valid ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.updateExpense(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }

    
    @GetMapping("/balances")  //current user’s balance summary (who owes whom)
    public ResponseEntity<List<BalanceResponse>> getBalanceSummary() {
        return ResponseEntity.ok(expenseService.getBalanceSummary());
    }


}
