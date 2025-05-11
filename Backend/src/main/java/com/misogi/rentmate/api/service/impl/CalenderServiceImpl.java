package com.misogi.rentmate.api.service.impl;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.misogi.rentmate.api.dto.response.CalendarEntryResponse;
import com.misogi.rentmate.api.model.Chore;
import com.misogi.rentmate.api.model.Expense;
import com.misogi.rentmate.api.model.Frequency;
import com.misogi.rentmate.api.model.Household;
import com.misogi.rentmate.api.model.User;
import com.misogi.rentmate.api.repository.ChoreRepository;
import com.misogi.rentmate.api.repository.ExpenseRepository;
import com.misogi.rentmate.api.service.ICalenderService;
import com.misogi.rentmate.api.service.IContextService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CalenderServiceImpl implements ICalenderService{
	
	private final IContextService contextService;
	private final ChoreRepository choreRepository;
	private final ExpenseRepository expenseRepository;

	@Override
	public List<CalendarEntryResponse> getCalendarEntries(LocalDate fromDate, LocalDate toDate) {
		User currentUser = contextService.getCurrentUser();
	    Household household = currentUser.getHousehold();

	    List<Chore> chores = choreRepository.findByHouseholdAndNextDueDateLessThanEqual(household, toDate);
	    List<Expense> expenses = expenseRepository.findByHouseholdAndAddedAtBetween(
	            household, fromDate.atStartOfDay(), toDate.atTime(LocalTime.MAX));

	    List<CalendarEntryResponse> entries = new ArrayList<>();

	    for (Chore chore : chores) {
	        List<String> dates = generateDueDatesInRange(chore.getNextDueDate(), chore.getFrequency(), fromDate, toDate);
	        if (!dates.isEmpty()) {
	            CalendarEntryResponse entry = new CalendarEntryResponse();
	            entry.setTitle("Chore: " + chore.getName());
	            entry.setType("CHORE");
	            entry.setDueDate(dates);
	            entries.add(entry);
	        }
	    }

	    for (Expense expense : expenses) {
	        CalendarEntryResponse entry = new CalendarEntryResponse();
	        entry.setTitle("Expense: " + expense.getDescription());
	        entry.setType("EXPENSE");
	        entry.setDueDate(List.of(expense.getAddedAt().toLocalDate().toString()));
	        entries.add(entry);
	    }

	    return entries;
	}
	
	private List<String> generateDueDatesInRange(LocalDate initialDate, Frequency frequency, LocalDate from, LocalDate to) {
	    List<String> dueDates = new ArrayList<>();
	    if (initialDate == null || initialDate.isAfter(to)) return dueDates;

	    LocalDate next = initialDate;

	    while (!next.isAfter(to)) {
	        if (!next.isBefore(from)) {
	            dueDates.add(next.toString());
	        }

	        switch (frequency) {
	            case DAILY:
	                next = next.plusDays(1);
	                break;
	            case WEEKLY:
	                next = next.plusWeeks(1);
	                break;
	            case MONTHLY:
	                next = next.plusMonths(1);
	                break;
	        }
	    }
	    return dueDates;
	}

}
