package com.misogi.rentmate.api.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.misogi.rentmate.api.dto.response.CalendarEntryResponse;
import com.misogi.rentmate.api.service.ICalenderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/calender")
@RequiredArgsConstructor
public class CalenderController {
	
	private final ICalenderService calenderService;

	@GetMapping("/entries")
	public List<CalendarEntryResponse> getCalendarEntries(
	        @RequestParam LocalDate fromDate,
	        @RequestParam LocalDate toDate) {
	    return calenderService.getCalendarEntries(fromDate, toDate);
	}
	
}
