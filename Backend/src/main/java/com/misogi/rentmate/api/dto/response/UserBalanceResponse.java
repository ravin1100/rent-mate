package com.misogi.rentmate.api.dto.response;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserBalanceResponse {

	private Long userId;
    private String name;
    private String email;
    private BigDecimal netBalance; // Positive = to receive, Negative = to pay
	
}
