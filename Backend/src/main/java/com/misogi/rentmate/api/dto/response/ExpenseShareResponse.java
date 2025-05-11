package com.misogi.rentmate.api.dto.response;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExpenseShareResponse {
	
	private String participantName;
    private BigDecimal shareAmount;

}
