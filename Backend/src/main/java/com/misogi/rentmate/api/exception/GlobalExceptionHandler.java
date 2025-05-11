package com.misogi.rentmate.api.exception;

import java.io.PrintWriter;
import java.io.StringWriter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.misogi.rentmate.api.common.DateTimeUtil;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
    @Value("${spring.profiles.active}")
    private String activeProfile;
	
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ExceptionResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex, WebRequest req) {

		ExceptionResponse error = ExceptionResponse.builder()
				.timestamp(DateTimeUtil.getCurrentTimestamp())
				.status(HttpStatus.BAD_GATEWAY.value())
				.error("INVALID_INPUT")
				.message(ex.getBindingResult().getFieldError().getDefaultMessage())
				.path(req.getDescription(false))
//				.stackTrace(activeProfile.equals("prod") ? null : getStackTraceAsString(ex)).build();
				.stackTrace(getStackTraceAsString(ex)).build();
		
		return new ResponseEntity<>(error, HttpStatus.BAD_GATEWAY);

	}
	
	@ExceptionHandler(BadRequestException.class)
	public ResponseEntity<ExceptionResponse> handleBadRequestException(BadRequestException ex, WebRequest webRequest){
		
		ExceptionResponse exceptionResponse =  new ExceptionResponse(DateTimeUtil.getCurrentTimestamp(),
				HttpStatus.BAD_REQUEST.value(), "BAD_REQUEST", ex.getLocalizedMessage(),
				webRequest.getDescription(false), this.getStackTraceAsString(ex));
		
		return new ResponseEntity<>(exceptionResponse, HttpStatus.BAD_REQUEST);
		
	}
	
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ExceptionResponse> handleException(Exception ex, WebRequest webRequest){
		
		ExceptionResponse exceptionResponse =  new ExceptionResponse(DateTimeUtil.getCurrentTimestamp(),
				HttpStatus.INTERNAL_SERVER_ERROR.value(), "INTERNAL_SERVER_ERROR", ex.getLocalizedMessage(),
				webRequest.getDescription(false), this.getStackTraceAsString(ex));
		
		return new ResponseEntity<>(exceptionResponse, HttpStatus.INTERNAL_SERVER_ERROR);
		
	}
	
	private String getStackTraceAsString(Exception ex) {
		StringWriter stringWriter = new StringWriter();
	    ex.printStackTrace(new PrintWriter(stringWriter));
	    return stringWriter.toString();
	}

}
