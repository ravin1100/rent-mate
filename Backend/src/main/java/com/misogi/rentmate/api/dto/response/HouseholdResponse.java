package com.misogi.rentmate.api.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdResponse {

	private Long id;
	private String name;
	private String inviteCode;
	private List<MemberResponse> members;

}
