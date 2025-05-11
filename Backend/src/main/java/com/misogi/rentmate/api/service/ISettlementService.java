package com.misogi.rentmate.api.service;

import java.math.BigDecimal;
import java.util.List;

import com.misogi.rentmate.api.dto.response.SettleUpSuggestionResponse;
import com.misogi.rentmate.api.dto.response.UserBalanceResponse;

public interface ISettlementService {
	
	 // Calculate net balance (amount owed or to receive) for each member
    List<UserBalanceResponse> calculateUserBalances();

    List<SettleUpSuggestionResponse> suggestSettlements(); // minimal list of transactions to settle up balances

    void recordSettlement(Long fromUserId, Long toUserId, BigDecimal amount);

}
