package com.misogi.rentmate.api.utility;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import org.springframework.stereotype.Component;

@Component
public class DateTimeUtil {
	
	private static final ZoneId zoneId = ZoneId.of("Asia/Kolkata");
	
//	private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd-MM-yyyy").withZone(zoneId);
	
	public static LocalDate getCurrentDate() {
		return LocalDate.now(zoneId);
	}
	
	public static Timestamp getCurrentTimeStamp() {
		return Timestamp.from(ZonedDateTime.now(zoneId).toInstant()); 
	}
	

}
