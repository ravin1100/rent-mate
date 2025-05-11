package com.misogi.rentmate.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.misogi.rentmate.api.model.Household;
import com.misogi.rentmate.api.model.User;


public interface IUserRepository extends JpaRepository<User, Long> {
	
//	@Query("SELECT u FROM User u WHERE u.email = :userName OR u.mobileNumber = :userName AND isDeleted = false")
//	Optional<User> findByEmailOrMobileAndIsDeletedFalse(@Param("userName") String userName);
	
//	Optional<User> findByEmailAndIsEnabledTrueAndIsDeletedFalse(String email);
	
	boolean existsByEmail(String email);
	
	Optional<User> findByEmail(String Email);
	
	List<User> findAllByIdIn(List<Long> ids);
	
	List<User> findAllByHousehold(Household household);
	
}
