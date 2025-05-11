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
public class ChoreResponse {

	private Long id;
	private String name;
	private String frequency;
	private String assignedUserName;
	private String assignedUserEmail;
	private String dueDate;
	private String nextUserName;
	private List<UserBasicResponse> allowedMembers;
	
}
