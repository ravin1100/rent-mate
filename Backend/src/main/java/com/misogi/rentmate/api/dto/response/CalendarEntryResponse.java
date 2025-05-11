package com.misogi.rentmate.api.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CalendarEntryResponse {
	
    private String title;
    private String type;         // "CHORE" or "EXPENSE"
    private List<String> dueDate;      
    
}
