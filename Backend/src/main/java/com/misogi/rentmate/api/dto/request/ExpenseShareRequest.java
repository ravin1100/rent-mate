package com.misogi.rentmate.api.dto.request;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExpenseShareRequest {

	private Long userId;
    private BigDecimal customShare; // if null, use equal-split
	
}
