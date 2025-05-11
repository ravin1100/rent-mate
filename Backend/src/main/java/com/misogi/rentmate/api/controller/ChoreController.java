package com.misogi.rentmate.api.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.misogi.rentmate.api.dto.request.ChoreRequest;
import com.misogi.rentmate.api.dto.response.ChoreAssignmentLogResponse;
import com.misogi.rentmate.api.dto.response.ChoreResponse;
import com.misogi.rentmate.api.service.IChoreService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chores")
@RequiredArgsConstructor
public class ChoreController {

	private final IChoreService choreService;

    @PostMapping("/create")
    public ResponseEntity<?> createChore(@RequestBody ChoreRequest choreRequest) {
        choreService.createChore(choreRequest);
        return new ResponseEntity<>(Map.ofEntries(Map.entry("message", "Creted Successfully")), HttpStatus.OK);
    }

    @PostMapping("/done")
    public ResponseEntity<?> markChoreDone(@RequestParam Long choreId, @RequestParam(required =  false) Long userId) {
        choreService.markChoreDone(choreId, userId);
        return new ResponseEntity<>(Map.ofEntries(Map.entry("message", "Mark As Completed")), HttpStatus.OK);
    }
    
    @GetMapping("/household/all-chores")
    public ResponseEntity<List<ChoreResponse>> getAssignedChores(@RequestParam(required = false) List<Long> userIds) {
    	return new ResponseEntity<>(choreService.getHouseholdAllChores(userIds), HttpStatus.OK);
    }
    
    @GetMapping("/logs")
    public List<ChoreAssignmentLogResponse> getChoreAssignmentLogs(@RequestParam(required = false) Long choreId, @RequestParam(required = false) Long userId) {
        return choreService.getLogsForChore(choreId, userId);
    }
	
}
