package com.misogi.rentmate.api.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.misogi.rentmate.api.common.DateTimeUtil;
import com.misogi.rentmate.api.dto.request.ExpenseRequest;
import com.misogi.rentmate.api.dto.request.ExpenseShareRequest;
import com.misogi.rentmate.api.dto.response.BalanceResponse;
import com.misogi.rentmate.api.dto.response.ExpenseResponse;
import com.misogi.rentmate.api.dto.response.ExpenseShareResponse;
import com.misogi.rentmate.api.exception.BadRequestException;
import com.misogi.rentmate.api.model.Expense;
import com.misogi.rentmate.api.model.ExpenseShare;
import com.misogi.rentmate.api.model.SplitMethod;
import com.misogi.rentmate.api.model.User;
import com.misogi.rentmate.api.repository.IExpenseRepository;
import com.misogi.rentmate.api.repository.IUserRepository;
import com.misogi.rentmate.api.service.IContextService;
import com.misogi.rentmate.api.service.IExpenseService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements IExpenseService{
	
	private final IUserRepository userRepository;
	private final IExpenseRepository expenseRepository;
	private final IContextService contextService;

	@Override
	public ExpenseResponse createExpense(ExpenseRequest request) {
		
		User payer = userRepository.findById(request.getPayerId())
				.orElseThrow(() -> new BadRequestException("Payer not found"));

	    Expense expense = new Expense();
	    expense.setAmount(request.getAmount());
	    expense.setDescription(request.getDescription());
	    expense.setAddedAt(LocalDateTime.now());
	    expense.setPayer(payer);
	    expense.setHousehold(payer.getHousehold());
	    expense.setCategory(request.getCategory());
	    expense.setSplitMethod(request.getSplitMethod());

	    List<ExpenseShareRequest> participants = request.getParticipants();
	    BigDecimal totalAmount = request.getAmount();
	    
	    if (request.getSplitMethod() == SplitMethod.CUSTOM) {
	        BigDecimal totalCustom = participants.stream()
	                .map(p -> p.getCustomShare() != null ? p.getCustomShare() : BigDecimal.ZERO)
	                .reduce(BigDecimal.ZERO, BigDecimal::add);

	        if (totalCustom.compareTo(totalAmount) != 0) {
	            throw new BadRequestException("Custom shares must sum up to total amount");
	        }
	    }

	    for (ExpenseShareRequest p : participants) {
	        User participant = userRepository.findById(p.getUserId()).orElseThrow();

	        ExpenseShare share = new ExpenseShare();
	        share.setExpense(expense);
	        share.setParticipant(participant);

	        if (request.getSplitMethod() == SplitMethod.CUSTOM) {
	            share.setShareAmount(p.getCustomShare());
	        } else { // EQUALLY
	            BigDecimal equalShare = totalAmount.divide(BigDecimal.valueOf(participants.size()), 2, RoundingMode.HALF_UP);
	            share.setShareAmount(equalShare);
	        }

	        expense.getShares().add(share);
	    }

	    expenseRepository.save(expense);
	    
	    return this.mapToResponse(expense);
		
	}

	@Override
	public List<ExpenseResponse> getExpenses(Long householdId, Long userId) {
		List<Expense> expenses = expenseRepository.findAll();

	    return expenses.stream().map(expense -> this.mapToResponse(expense)).toList();
	}

	@Override
	public ExpenseResponse getExpenseById(Long id) {
		Expense expense = expenseRepository.findById(id)
		        .orElseThrow(() -> new BadRequestException("Expense not found"));
		return this.mapToResponse(expense);
	}

	@Override
	public ExpenseResponse updateExpense(Long id, @Valid ExpenseRequest request) {
		Expense expense = expenseRepository.findById(id)
		        .orElseThrow(() -> new BadRequestException("Expense not found"));

		    User payer = userRepository.findById(request.getPayerId())
		        .orElseThrow(() -> new BadRequestException("Payer not found"));

		    expense.setAmount(request.getAmount());
		    expense.setDescription(request.getDescription());
		    expense.setAddedAt(LocalDateTime.now());
		    expense.setPayer(payer);
		    expense.setSplitMethod(request.getSplitMethod());
		    expense.setCategory(request.getCategory());
		    

		    expense.getShares().clear(); // Clear existing shares

		    List<ExpenseShareRequest> participants = request.getParticipants();
		    BigDecimal totalAmount = request.getAmount();

		    if (request.getSplitMethod() == SplitMethod.CUSTOM) {
		        BigDecimal totalCustom = participants.stream()
		            .map(p -> p.getCustomShare() != null ? p.getCustomShare() : BigDecimal.ZERO)
		            .reduce(BigDecimal.ZERO, BigDecimal::add);

		        if (totalCustom.compareTo(totalAmount) != 0) {
		            throw new BadRequestException("Custom shares must match total amount");
		        }
		    }

		    for (ExpenseShareRequest p : participants) {
		        User participant = userRepository.findById(p.getUserId())
		            .orElseThrow(() -> new BadRequestException("Participant not found"));

		        ExpenseShare share = new ExpenseShare();
		        share.setExpense(expense);
		        share.setParticipant(participant);

		        if (request.getSplitMethod() == SplitMethod.CUSTOM) {
		            share.setShareAmount(p.getCustomShare());
		        } else { // EQUALLY
		            BigDecimal equalShare = totalAmount.divide(
		                BigDecimal.valueOf(participants.size()), 2, RoundingMode.HALF_UP);
		            share.setShareAmount(equalShare);
		        }

		        expense.getShares().add(share);
		    }

		    expenseRepository.save(expense);
		    return mapToResponse(expense);
	}

	@Override
	public void deleteExpense(Long id) {
		Expense expense = expenseRepository.findById(id)
		        .orElseThrow(() -> new BadRequestException("Expense not found"));
		expenseRepository.delete(expense);
	}

	@Override
	public List<BalanceResponse> getBalanceSummary() {
		User user = contextService.getCurrentUser();
		 List<Expense> expenses = expenseRepository.findAllByHousehold(user.getHousehold());

		    Map<String, BigDecimal> balances = new HashMap<>();

		    for (Expense expense : expenses) {
		        String payerEmail = expense.getPayer().getEmail();

		        for (ExpenseShare share : expense.getShares()) {
		            String participantEmail = share.getParticipant().getEmail();

		            if (!payerEmail.equals(participantEmail)) {
		                String key = participantEmail + "->" + payerEmail;
		                balances.put(key, balances.getOrDefault(key, BigDecimal.ZERO).add(share.getShareAmount()));
		            }
		        }
		    }

		    List<BalanceResponse> responseList = new ArrayList<>();
		    for (Map.Entry<String, BigDecimal> entry : balances.entrySet()) {
		        String[] users = entry.getKey().split("->");
		        responseList.add(BalanceResponse.builder()
		            .fromUser(users[0])
		            .toUser(users[1])
		            .amount(entry.getValue())
		            .build());
		    }

		    return responseList;
	}
	
	private ExpenseResponse mapToResponse(Expense expense) {
		return ExpenseResponse.builder()
	            .id(expense.getId())
	            .amount(expense.getAmount())
	            .description(expense.getDescription())
	            .addedAt(DateTimeUtil.getDateTimeString(expense.getAddedAt()))
	            .payerName(expense.getPayer().getFirstName() + " " + expense.getPayer().getLastName())
	            .splitMethod(expense.getSplitMethod())
	            .category(expense.getCategory())
	            .shares(expense.getShares().stream().map(s -> ExpenseShareResponse.builder()
	                .participantName(s.getParticipant().getFirstName() + " " + s.getParticipant().getLastName())
	                .shareAmount(s.getShareAmount())
	                .build()).toList())
	            .build();
	}

}
