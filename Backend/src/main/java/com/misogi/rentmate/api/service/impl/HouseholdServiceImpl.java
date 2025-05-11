package com.misogi.rentmate.api.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.misogi.rentmate.api.dto.request.HouseholdRequest;
import com.misogi.rentmate.api.dto.response.HouseholdResponse;
import com.misogi.rentmate.api.dto.response.MemberResponse;
import com.misogi.rentmate.api.exception.BadRequestException;
import com.misogi.rentmate.api.model.Household;
import com.misogi.rentmate.api.model.Role;
import com.misogi.rentmate.api.model.User;
import com.misogi.rentmate.api.repository.HouseholdRepository;
import com.misogi.rentmate.api.repository.IUserRepository;
import com.misogi.rentmate.api.service.IContextService;
import com.misogi.rentmate.api.service.IEmailService;
import com.misogi.rentmate.api.service.IHouseholdService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HouseholdServiceImpl implements IHouseholdService{
	
	private final HouseholdRepository householdRepository;
	private final IUserRepository userRepository;
	private final IContextService contextService;
	private final IEmailService emailService;

	@Override
	public void createHousehold(HouseholdRequest request) {
		User owner = contextService.getCurrentUser();
		 Household household = Household.builder()
	                .name(request.getName())
	                .inviteCode(UUID.randomUUID().toString().substring(0, 6))
	                .members(new ArrayList<>())
	                .build();
	     Household savedHousehold = householdRepository.save(household);
	     owner.setHousehold(savedHousehold);
		 owner.setRole(Role.ROLE_OWNER);
		 userRepository.save(owner);
	}
	
	@Override
	public void joinHousehold(String inviteCode) {
		User user = contextService.getCurrentUser();
		Household household = householdRepository.findByInviteCode(inviteCode);
		user.setHousehold(household);
		user.setRole(Role.ROLE_MEMBER);
		userRepository.save(user);
		
	}

	@Override
	public List<User> getHouseholdMembers(Long householdId) {
		 return userRepository.findAll().stream()
	                .filter(u -> u.getHousehold() != null && u.getHousehold().getId().equals(householdId))
	                .toList();
	}

	@Override
	public HouseholdResponse getHousehold() {
		User currentUser = contextService.getCurrentUser();
		Household household = currentUser.getHousehold();
		if(household == null) {
			throw new BadRequestException("No household found");
		}
		return this.mapToResponse(household);
	}
	
	private HouseholdResponse mapToResponse(Household household) {
	    HouseholdResponse response = new HouseholdResponse();
	    response.setId(household.getId());
	    response.setName(household.getName());
	    response.setInviteCode(household.getInviteCode());

	    List<MemberResponse> memberDtos = household.getMembers().stream().map(member -> {
	    	MemberResponse dto = new MemberResponse();
	        dto.setId(member.getId());
	        dto.setFirstName(member.getFirstName());
	        dto.setLastName(member.getLastName());
	        dto.setEmail(member.getEmail());
	        dto.setRole(member.getRole());
	        return dto;
	    }).toList();

	    response.setMembers(memberDtos);
	    return response;
	}

	@Override
	public void sendInviteToEmails(List<String> emails) {
		User currentUser = contextService.getCurrentUser();
		Household household = currentUser.getHousehold();
		if(household == null) {
			throw new BadRequestException("Household not found");
		}
        String inviteCode = household.getInviteCode();

        for (String email : emails) {
        	try {
				emailService.sendInviteEmail(email, inviteCode);
			} catch (Exception e) {
				e.printStackTrace();
			}
        }
	}


}
