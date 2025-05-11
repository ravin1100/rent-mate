package com.misogi.rentmate.api.dto.response;

import java.math.BigDecimal;
import java.util.List;

import com.misogi.rentmate.api.model.SplitMethod;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ExpenseResponse {

	private Long id;
    private BigDecimal amount;
    private String description;
    private String addedAt;
    private String payerName;
    private String category;
    private SplitMethod splitMethod;
    private List<ExpenseShareResponse> shares;
	
}
