# expense_tracker#  Expense Tracker

An expense tracking application built with Node.js, Express.js, HTML, CSS, and JavaScript.

The application allows users to manage expenses, filter records, view spending summaries, and analyze financial data through interactive charts and dashboard metrics.

---

# Features

## Expense Management

* Add new expenses
* Edit existing expenses
* Delete expenses
* View all expenses

## Search & Filtering

* Search expenses by title
* Filter expenses by category
* Filter expenses by date range
* Combined filtering support

## Analytics Dashboard

* Total expenses overview
* Total transactions count
* Top spending category
* Monthly spending summary
* Category-wise expense breakdown

## Visualizations

* Doughnut chart for category distribution
* Bar chart for spending analysis
* Dynamic chart updates based on filters

## Persistence

* Data stored in `expenses.json`
* Expenses persist across application restarts


---

# Tech Stack

## Backend

* Node.js
* Express.js

## Frontend

* HTML5
* CSS3
* Vanilla JavaScript

## Data Visualization

* Chart.js

## Storage

* JSON File Storage (`expenses.json`)

---



---

# Installation & Setup

## Clone the Repository

```bash
git clone https://github.com/rohitoxy/expense_tracker.git
```

## Navigate to Project Directory

```bash
cd expense_tracker
```

## Install Dependencies

```bash
npm install
```

## Run the Application

```bash
node server.js
```

## Open in Browser

```text
http://localhost:3000
```

---



# Design Decisions

## Why JSON Storage?

For this assessment, JSON file storage was selected instead of a relational database.

Reasons:

* Faster implementation within the assessment timeframe
* No external setup required
* Easy local persistence
* Reduced infrastructure complexity
* Allowed more focus on functionality, UX, and analytics

The application can be migrated to PostgreSQL in the future by replacing the file-based persistence layer with database operations.

---

# Trade-Offs

## Implemented

### Core Expense Management

Implemented complete CRUD functionality with persistent storage.

### Analytics Dashboard

Added dashboard metrics and visualizations to provide meaningful insights rather than only displaying raw expense data.

### Modern User Interface

Focused on creating a clean, responsive dashboard experience with dark theme styling and animations.

---

## Not Implemented

### PostgreSQL Integration

Skipped due to assessment time constraints.

JSON storage was sufficient for demonstrating functionality and persistence.

### Authentication

User authentication and authorization were outside the scope of the assessment.

### Export Features

CSV/PDF export functionality was not implemented to prioritize core requirements and analytics features.

---

# Validation & Edge Cases Handled

## Input Validation

* Title is required
* Title cannot contain only whitespace
* Amount must be greater than zero

## Date Validation

* Prevents invalid date ranges
* From Date cannot be later than To Date

## Empty States

* Displays "No expenses found" when filters return no results

## User Actions

* Delete confirmation before removal
* Edit updates existing expense records

## Data Handling

* Optional notes supported
* Persistent storage between restarts

---

# Known Limitations

* Single-user application
* Uses file-based storage
* No authentication system
* No pagination for large datasets
* No export functionality

---

# Future Enhancements

* PostgreSQL integration
* User authentication and authorization
* Budget planning and tracking
* Recurring expenses
* CSV/PDF export
* Monthly trend analysis
* Advanced reporting dashboard
* Cloud deployment

---

# Author

**Rohit**

Submitted as part of the Riafy Software Engineering Assessment.
