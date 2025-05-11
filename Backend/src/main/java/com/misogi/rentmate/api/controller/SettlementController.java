package com.misogi.rentmate.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.misogi.rentmate.api.dto.response.SettleUpSuggestionResponse;
import com.misogi.rentmate.api.dto.response.UserBalanceResponse;
import com.misogi.rentmate.api.service.ISettlementService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/settlement")
@RequiredArgsConstructor
public class SettlementController {
	
	private final ISettlementService settlementService;
	
    @GetMapping("/balances")
    public ResponseEntity<List<UserBalanceResponse>> getUserBalances() {
        List<UserBalanceResponse> balances = settlementService.calculateUserBalances();
        return ResponseEntity.ok(balances);
    }

    @GetMapping("/settle-up-suggestion")
    public ResponseEntity<List<SettleUpSuggestionResponse>> getSettleUpSuggestions() {
        List<SettleUpSuggestionResponse> suggestions = settlementService.suggestSettlements();
        return ResponseEntity.ok(suggestions);
    }

}
