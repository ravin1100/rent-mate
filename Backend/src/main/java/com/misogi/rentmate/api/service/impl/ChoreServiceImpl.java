package com.misogi.rentmate.api.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.misogi.rentmate.api.dto.request.ChoreRequest;
import com.misogi.rentmate.api.dto.response.ChoreAssignmentLogResponse;
import com.misogi.rentmate.api.dto.response.ChoreResponse;
import com.misogi.rentmate.api.dto.response.UserBasicResponse;
import com.misogi.rentmate.api.exception.BadRequestException;
import com.misogi.rentmate.api.model.Chore;
import com.misogi.rentmate.api.model.ChoreAssignmentLog;
import com.misogi.rentmate.api.model.Frequency;
import com.misogi.rentmate.api.model.Household;
import com.misogi.rentmate.api.model.User;
import com.misogi.rentmate.api.repository.ChoreAssignmentLogRepository;
import com.misogi.rentmate.api.repository.ChoreRepository;
import com.misogi.rentmate.api.repository.IUserRepository;
import com.misogi.rentmate.api.service.IChoreService;
import com.misogi.rentmate.api.service.IContextService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChoreServiceImpl implements IChoreService{

	private final ChoreRepository choreRepository;
	private final IContextService contextService;
	private final IUserRepository userRepository;
	private final ChoreAssignmentLogRepository choreAssignmentLogRepository;
	
	@Override
	public void createChore(ChoreRequest choreRequest) {
		
		User currentUser = contextService.getCurrentUser();
		Household household = currentUser.getHousehold();
		
		 if(choreRequest.getAllowedMemebers().isEmpty()) {
			 throw new BadRequestException("No members found");
		 }
		 
		 if(choreRequest.getAllowedMemebers().size()<=1) {
			 throw new BadRequestException("Minimum two members required to rotate the chore");
		 }

		 List<User> allowedUsers = userRepository.findAllByIdIn(choreRequest.getAllowedMemebers());
		 Frequency frequency = Frequency.valueOf(choreRequest.getFrequency());

		Chore chore = Chore.builder().name(choreRequest.getName())
					.frequency(frequency)
					.household(household)
					.createdBy(currentUser)
					.currentlyAssignedTo(allowedUsers.get(0))
					.nextAssignedTo(null)
					.active(true)
					.nextDueDate(getNextDueDate(LocalDate.now(), frequency))
					.allowedUsers(allowedUsers)
					.build();

		choreRepository.save(chore);
		
		ChoreAssignmentLog log = new ChoreAssignmentLog();
	    log.setChore(chore);
	    log.setAssignedTo(allowedUsers.get(0));
	    log.setAssignedOn(LocalDate.now());
	    
	    choreAssignmentLogRepository.save(log);
		
	}

	
	 private LocalDate getNextDueDate(LocalDate date, Frequency frequency) {
	        switch (frequency) {
	            case DAILY:
	                return date.plusDays(1);
	            case WEEKLY:
	                return date.plusWeeks(1);
	            case MONTHLY:
	                return date.plusMonths(1);
	            default:
	                return date;
	        }
	    }
	
	@Override
	public void markChoreDone(Long choreId, Long userId) {
		User user;
		if(userId == null) {
			user = contextService.getCurrentUser();
		}
		else {
			userRepository.findById(userId);
		}
		Chore chore = choreRepository.findById(choreId).orElseThrow(() -> new BadRequestException("Chore not found"));
	    assignNextMemberToChore(chore);
	}

	private void assignNextMemberToChore(Chore chore) {
		
        List<User> users = chore.getAllowedUsers();
        
		User lastUser = chore.getCurrentlyAssignedTo();
		int nextUserIndex = (users.indexOf(lastUser) + 1) % users.size(); // Rotating the members in the list

        // Assign the next member in the rotation
        User nextUser = users.get(nextUserIndex);
        User nextToNextUser = users.get((nextUserIndex + 1) % users.size());
        
        chore.setCurrentlyAssignedTo(nextUser);
        chore.setNextAssignedTo(nextToNextUser);
        chore.setNextDueDate(getNextDueDate(chore.getNextDueDate(), chore.getFrequency()));
        choreRepository.save(chore);
        
        Optional<ChoreAssignmentLog> lastLogOpt = choreAssignmentLogRepository
        	    .findTopByChoreAndCompletedOnIsNullOrderByAssignedOnDesc(chore);
        
        if (lastLogOpt.isPresent()) {
            ChoreAssignmentLog lastLog = lastLogOpt.get();
            lastLog.setCompletedOn(LocalDate.now());
            choreAssignmentLogRepository.save(lastLog);
        }

        ChoreAssignmentLog newLog = new ChoreAssignmentLog();
        newLog.setChore(chore);
        newLog.setAssignedTo(nextUser);
        newLog.setAssignedOn(LocalDate.now());
        choreAssignmentLogRepository.save(newLog);
        
    }

	@Override
	public List<ChoreResponse> getHouseholdAllChores(List<Long> userIds) {
		User currentUser = contextService.getCurrentUser();
		Long householdId = currentUser.getHousehold().getId();
		List<Chore> chores = null;
		if(userIds == null || userIds.isEmpty()) {
			chores = choreRepository.findAllByHouseholdId(householdId);
		}else {
			chores = choreRepository.findByCurrentlyAssignedToIdIn(userIds);
		}
		
		return chores.stream().map(chore -> {
			
			User assignedTo = chore.getCurrentlyAssignedTo();
			
	        ChoreResponse response = new ChoreResponse();
	        response.setId(chore.getId());
	        response.setName(chore.getName());
	        response.setFrequency(chore.getFrequency().name());

	        if (chore.getCurrentlyAssignedTo() != null) {
	            response.setAssignedUserName(assignedTo.getFirstName() + " " + assignedTo.getLastName());
	            response.setAssignedUserEmail(assignedTo.getEmail());
	        }

	        if (chore.getNextAssignedTo() != null) {
	            response.setNextUserName(chore.getNextAssignedTo()==null?null: chore.getNextAssignedTo().getFirstName()+" "+
	            		chore.getNextAssignedTo().getLastName());
	        }

	        if (chore.getNextDueDate() != null) {
	            response.setDueDate(chore.getNextDueDate().toString());
	        }

	        List<UserBasicResponse> allowedMembers = chore.getAllowedUsers().stream().map(user -> {
	            UserBasicResponse u = new UserBasicResponse();
	            u.setId(user.getId());
	            u.setName(user.getFirstName() + " " + user.getLastName());
	            u.setEmail(user.getEmail());
	            return u;
	        }).collect(Collectors.toList());

	        response.setAllowedMembers(allowedMembers);

	        return response;
	    }).collect(Collectors.toList());
		
	}


	@Override
	public List<ChoreAssignmentLogResponse> getLogsForChore(Long choreId, Long userId) {
		User currentUser = contextService.getCurrentUser();
		Household household = currentUser.getHousehold();
		List<Chore> chores;
		if(choreId == null) {
			chores = choreRepository.findAllByHouseholdId(household.getId());
		}
		else {
			Chore chore = choreRepository.findById(choreId).orElseThrow(() -> new BadRequestException("Chore not found"));
			chores = List.of(chore);
		}
		
		List<ChoreAssignmentLog> logs;
		if(userId == null) {
			logs = choreAssignmentLogRepository.findByChoreIn(chores);
		}
		else {
			logs = choreAssignmentLogRepository.findByChoreInAndAssignedToIdIn(chores, List.of(userId));
		}
		

		    return logs.stream().map(log -> {
		        ChoreAssignmentLogResponse response = new ChoreAssignmentLogResponse();
		        response.setId(log.getId());
		        response.setChoreName(log.getChore().getName());
		        response.setAssignedToName(log.getAssignedTo()==null?null:log.getAssignedTo().getFirstName()+" "+log.getAssignedTo().getLastName());
		        response.setAssignedToEmail(log.getAssignedTo().getEmail());
		        response.setAssignedOn(log.getAssignedOn() != null ? log.getAssignedOn().toString() : null);
		        response.setCompletedOn(log.getCompletedOn() != null ? log.getCompletedOn().toString() : null);
		        return response;
		    }).collect(Collectors.toList());
	}

}
