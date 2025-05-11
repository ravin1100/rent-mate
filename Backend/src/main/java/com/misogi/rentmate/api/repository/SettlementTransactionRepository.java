package com.misogi.rentmate.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.misogi.rentmate.api.model.SettlementTransaction;

public interface SettlementTransactionRepository extends JpaRepository<SettlementTransaction, Long> {}
