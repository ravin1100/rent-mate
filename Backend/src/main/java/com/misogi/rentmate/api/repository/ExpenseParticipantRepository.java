package com.misogi.rentmate.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.misogi.rentmate.api.model.ExpenseShare;

public interface ExpenseParticipantRepository extends JpaRepository<ExpenseShare, Long> {}
