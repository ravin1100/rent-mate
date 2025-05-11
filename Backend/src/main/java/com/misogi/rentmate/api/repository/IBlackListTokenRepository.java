package com.misogi.rentmate.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.misogi.rentmate.api.model.BlackListToken;

public interface IBlackListTokenRepository extends JpaRepository<BlackListToken, Long>{

}
