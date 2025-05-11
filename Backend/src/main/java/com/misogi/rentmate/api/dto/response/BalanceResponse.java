package com.misogi.rentmate.api.dto.response;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BalanceResponse {

	private String fromUser;
    private String toUser;
    private BigDecimal amount;
	
}
