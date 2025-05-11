package com.misogi.rentmate.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.misogi.rentmate.api.model.Chore;
import com.misogi.rentmate.api.model.ChoreAssignmentLog;
import com.misogi.rentmate.api.model.User;

public interface ChoreAssignmentLogRepository extends JpaRepository<ChoreAssignmentLog, Long>{
	
	Optional<ChoreAssignmentLog> findTopByChoreAndCompletedOnIsNullOrderByAssignedOnDesc(Chore chore);
	
	List<ChoreAssignmentLog> findByChoreIn(List<Chore> chores);
	
	List<ChoreAssignmentLog> findByChoreInAndAssignedToIdIn(List<Chore> chores, List<Long> userIds);

}
