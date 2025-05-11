package com.misogi.rentmate.api.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Chore {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String name;
	
	@Enumerated(EnumType.STRING)
	private Frequency frequency; 

	@ManyToOne
	private Household household;
	
	@ManyToOne
	private User createdBy;
	
	@ManyToOne
	private User currentlyAssignedTo;
	
	private LocalDate nextDueDate;
	
	@ManyToOne
	private User nextAssignedTo;

    private boolean active;
	
	@ManyToMany
	@JoinTable(
		name = "chore_allowed_users",
		joinColumns = @JoinColumn(name = "chore_id"),
		inverseJoinColumns = @JoinColumn(name = "user_id")
	)
	private List<User> allowedUsers;
	
}
