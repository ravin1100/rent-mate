package com.misogi.rentmate.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserBasicResponse {

	private Long id;
	private String name;
	private String email;
	
}
