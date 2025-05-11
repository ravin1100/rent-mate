package com.misogi.rentmate.api.service;

import java.time.LocalDate;
import java.util.List;

import com.misogi.rentmate.api.dto.response.CalendarEntryResponse;

public interface ICalenderService {
	
	List<CalendarEntryResponse> getCalendarEntries(LocalDate fromDate, LocalDate toDate);

}
