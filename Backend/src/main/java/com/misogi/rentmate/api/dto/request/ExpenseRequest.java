package com.misogi.rentmate.api.dto.request;

import java.math.BigDecimal;
import java.util.List;

import com.misogi.rentmate.api.model.SplitMethod;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExpenseRequest {
	
    private BigDecimal amount;
    private String description;
    private String Category;
    private Long payerId;
    private SplitMethod splitMethod;
    private List<ExpenseShareRequest> participants;
    
}
