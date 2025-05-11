# RentMate – Roommate Chore & Expense Scheduler

RentMate is a tool designed to simplify shared living by helping roommates manage chores and expenses efficiently.

## Scenario

Roommates often face challenges in coordinating chores and tracking shared bills. Manual methods like spreadsheets and group chats can be disorganized and lead to misunderstandings.

## 🎯 Objective

To create a centralized platform where roommates can:
*   Join a shared household.
*   Assign and track rotating chores.
*   Log shared expenses.
*   Automatically calculate individual financial balances.
*   View all activities on a unified calendar.

## 👥 User Role: user

All users within a household can participate in managing chores and expenses.

## 🔐 Authentication & Authorization

*   **Login Required**: Users must log in to create or join a household.
*   **Household Management**: The household owner can manage memberships.
*   **Shared Access**: All members can log chores and expenses.

## 🧱 Core Functional Modules

### Household Setup & Membership
*   Create a new household or join an existing one using a unique code or email invite.
*   View a list of household members and their roles (Owner vs. Member).

### Chore Rotation Scheduler
*   Define chores with customizable frequencies (e.g., Daily, Weekly, Monthly).
*   Automatically assign chores to the next member in rotation.
*   Mark chores as completed, logging the date and the completer.

### Shared Expense Logging
*   Log expenses with details such as amount, description, date, payer, and participants (selectable via checkboxes).
*   Default to equal splitting of expenses, with an option for custom share percentages.

### Balance & Settlement
*   A dashboard displaying the net financial balance for each member (amount owed or to receive).
*   "Settle Up" suggestions to provide a list of minimal transactions needed to clear debts.

### Calendar View
*   A combined monthly calendar displaying due dates for chores and expenses.
*   Color-coded entries to distinguish between different types of activities.

### History & Export
*   A chronological log of all completed chores and logged expenses.
*   Option to export data to a CSV file.

## 🛠️ Tech Stack

*   **Backend**: Java Spring Boot
*   **Frontend**: React

## 🌐 Application Access

You can access the application using the following details:

*   **Login URL**: [https://rent-mate-tracker.netlify.app/login](https://rent-mate-tracker.netlify.app/login)
*   **Email**: badal1906@gmail.com
*   **Password**: Demo@123
