package com.misogi.rentmate.api.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;

import javax.swing.Icon;

import org.springframework.stereotype.Service;

import com.misogi.rentmate.api.dto.response.SettleUpSuggestionResponse;
import com.misogi.rentmate.api.dto.response.UserBalanceResponse;
import com.misogi.rentmate.api.model.Expense;
import com.misogi.rentmate.api.model.ExpenseShare;
import com.misogi.rentmate.api.model.Household;
import com.misogi.rentmate.api.model.User;
import com.misogi.rentmate.api.repository.IExpenseRepository;
import com.misogi.rentmate.api.repository.IUserRepository;
import com.misogi.rentmate.api.service.IContextService;
import com.misogi.rentmate.api.service.ISettlementService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SettlementServiceImpl implements ISettlementService{
	
	private final IExpenseRepository expenseRepository;
	private final IUserRepository userRepository;
	private final IContextService contextService;

	@Override
	public List<UserBalanceResponse> calculateUserBalances() {
		
		User user = contextService.getCurrentUser();
		Household household = user.getHousehold();
		
		List<User> allUsers = userRepository.findAllByHousehold(household);
		List<Expense> allExpenses = expenseRepository.findAllByHousehold(household);
	    Map<Long, BigDecimal> paidMap = new HashMap<>();
	    Map<Long, BigDecimal> owedMap = new HashMap<>();

	    for (Expense e : allExpenses) {
	        Long payerId = e.getPayer().getId();
	        paidMap.put(payerId, paidMap.getOrDefault(payerId, BigDecimal.ZERO).add(e.getAmount()));

	        for (ExpenseShare share : e.getShares()) {
	            Long uid = share.getParticipant().getId();
	            owedMap.put(uid, owedMap.getOrDefault(uid, BigDecimal.ZERO).add(share.getShareAmount()));
	        }
	    }

	    List<UserBalanceResponse> result = new ArrayList<>();
	    for (User u : allUsers) {
	        BigDecimal paid = paidMap.getOrDefault(u.getId(), BigDecimal.ZERO);
	        BigDecimal owed = owedMap.getOrDefault(u.getId(), BigDecimal.ZERO);
	        result.add(UserBalanceResponse.builder()
	            .userId(u.getId())
	            .name(u.getFirstName() + " " + u.getLastName())
	            .netBalance(paid.subtract(owed))
	            .build());
	    }

	    return result;
	}

	@Override
	public List<SettleUpSuggestionResponse> suggestSettlements() {
		
		List<UserBalanceResponse> balances = calculateUserBalances();

	    PriorityQueue<UserBalanceResponse> debtors = new PriorityQueue<>(Comparator.comparing(UserBalanceResponse::getNetBalance));
	    PriorityQueue<UserBalanceResponse> creditors = new PriorityQueue<>((a, b) -> b.getNetBalance().compareTo(a.getNetBalance()));

	    for (UserBalanceResponse ub : balances) {
	        if (ub.getNetBalance().compareTo(BigDecimal.ZERO) < 0) debtors.add(ub);
	        else if (ub.getNetBalance().compareTo(BigDecimal.ZERO) > 0) creditors.add(ub);
	    }

	    List<SettleUpSuggestionResponse> settlements = new ArrayList<>();

	    while (!debtors.isEmpty() && !creditors.isEmpty()) {
	        UserBalanceResponse debtor = debtors.poll();
	        UserBalanceResponse creditor = creditors.poll();

	        BigDecimal debt = debtor.getNetBalance().abs();
	        BigDecimal credit = creditor.getNetBalance();
	        BigDecimal transfer = debt.min(credit);

	        settlements.add(SettleUpSuggestionResponse.builder()
	            .fromUserId(debtor.getUserId())
	            .fromUserName(debtor.getName())
	            .toUserId(creditor.getUserId())
	            .toUserName(creditor.getName())
	            .amount(transfer)
	            .build());

	        // Adjust balances
	        BigDecimal newDebtorBal = debtor.getNetBalance().add(transfer);
	        BigDecimal newCreditorBal = creditor.getNetBalance().subtract(transfer);

	        if (newDebtorBal.compareTo(BigDecimal.ZERO) < 0) {
	            debtor.setNetBalance(newDebtorBal);
	            debtors.add(debtor);
	        }

	        if (newCreditorBal.compareTo(BigDecimal.ZERO) > 0) {
	            creditor.setNetBalance(newCreditorBal);
	            creditors.add(creditor);
	        }
	    }

	    return settlements;

	}

	@Override
	public void recordSettlement(Long fromUserId, Long toUserId, BigDecimal amount) {
		
	}

}
