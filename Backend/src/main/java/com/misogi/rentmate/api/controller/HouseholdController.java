package com.misogi.rentmate.api.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.misogi.rentmate.api.dto.SendInviteRequest;
import com.misogi.rentmate.api.dto.request.HouseholdRequest;
import com.misogi.rentmate.api.dto.response.HouseholdResponse;
import com.misogi.rentmate.api.service.IHouseholdService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/households")
public class HouseholdController {
	
	private final IHouseholdService householdService;

    @PostMapping("/create")
    public ResponseEntity<?> createHousehold(@RequestBody HouseholdRequest request) {
    	householdService.createHousehold(request);
        return new ResponseEntity<>(Map.ofEntries(Map.entry("message", "Household creted successfully")), HttpStatus.OK);
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinHousehold(@RequestParam String inviteCode) {
        householdService.joinHousehold(inviteCode);
        return new ResponseEntity<>(Map.ofEntries(Map.entry("message", "User joined the household successfully!")), HttpStatus.OK);
    }

//    @GetMapping("/{householdId}/members")
//    public List<User> getMembers(@PathVariable Long householdId) {
//        return householdService.getHouseholdMembers(householdId);
//    }
    
    @GetMapping("/my-household")
    public ResponseEntity<HouseholdResponse> getHouseHold() {
        HouseholdResponse response = householdService.getHousehold();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    @PostMapping("/{householdId}/send-invite")
    public ResponseEntity<?> sendInvite(@RequestBody SendInviteRequest sendInviteRequest) {
        householdService.sendInviteToEmails(sendInviteRequest.getEmails());
        return ResponseEntity.ok(Map.ofEntries(Map.entry("message", "Invite sent successfully")));
    }
	
	

}
