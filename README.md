# RateStore

A full stack web application where users can discover local stores and rate
them from 1 to 5. Built as part of a Full Stack Developer internship coding
challenge.

The idea is simple one login system, three roles, three very different
experiences. A normal user browses and rates stores, a store owner tracks
how their store is doing, and an admin manages the whole platform from a
single dashboard.

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Demo Credentials](#demo-credentials)
- [Form Validations](#form-validations)
- [Database Schema](#database-schema)
- [Future Improvements](#future-improvements)

---

## About

RateStore is a role based store rating platform. There's a single login
page for everyone, but what you see after logging in depends on your role:

- **Normal users** sign up, browse stores, search by name or address, and
  rate any store from 1 to 5. They can also update a rating they already
  submitted.
- **Store owners** get a dashboard showing their store's average rating and
  a list of everyone who rated them.
- **Admins** get a dashboard with platform-wide stats and full control over
  users and stores adding new ones, filtering listings, sorting columns,
  and viewing detailed profiles.

---

## Features

**Authentication**
- Single login for all three roles, with JWT based sessions
- Public signup page for normal users
- Change password from within the app for any logged in user

**Normal User**
- Browse all registered stores
- Search stores by name and address
- See a store's overall rating alongside your own submitted rating
- Submit a new rating or modify an existing one, right from the store card

**Store Owner**
- Dashboard showing the store's current average rating
- Table of every user who has rated the store, with their rating

**System Administrator**
- Dashboard with total users, total stores, and total ratings submitted
- Add new users (normal, admin, or store owner) with name, email, password
  and address
- Add new stores, optionally assigning an existing store owner
- View and filter the user list by name, email, address, and role
- View and filter the store list by name, email, and address
- Sort any listing column ascending or descending
- View a full profile for any user store owners additionally show their
  store's rating

**Everyone**
- Log out from anywhere in the app

---

## Tech Stack

| Layer     | Technology                          |
|-----------|--------------------------------------|
| Frontend  | React (Vite), React Router, Axios    |
| Backend   | Node.js, Express.js                  |
| Database  | MySQL                                |
| Auth      | JWT, bcrypt for password hashing     |
| Styling   | Plain CSS (no framework)             |

---

## Getting Started

### 1. Database

Make sure MySQL is running, then create the schema

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env` with your own values:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME= database name 
JWT_SECRET=any_long_random_string
```

Start the server:

```bash
npm run dev
```

Runs on `http://localhost:5000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`.

---

## Demo Credentials

The schema seeds one admin account by default. The other two accounts
below are optional sample data you can insert to try out the store owner
and normal user experience see the comments in `schema.sql` or insert
them manually.

| Role         | Email                  | Password    |
|--------------|-------------------------|-------------|
| Admin        | admin@ratestore.com     | Admin@123   |
| Store Owner  | owner1@ratestore.com    | Owner@123   |
| Normal User  | user1@ratestore.com     | User@123    |

> These are demo/development credentials only, meant for testing the app
> locally. They should be changed or removed before any real deployment.

---

## Form Validations

| Field    | Rule                                                              |
|----------|--------------------------------------------------------------------|
| Name     | 20–60 characters                                                   |
| Address  | Up to 400 characters                                                |
| Email    | Must be a valid email format                                       |
| Password | 8–16 characters, at least one uppercase letter and one special char |
| Rating   | Integer between 1 and 5                                            |

Validation is enforced on both the frontend (for instant feedback) and the
backend (as the actual source of truth).

---

## Database Schema

Three tables, kept intentionally simple:

- **users** — stores everyone regardless of role (`admin`, `user`,
  `store_owner`), with a hashed password
- **stores** — each store optionally linked to a `store_owner` via
  `owner_id`
- **ratings** — one row per user per store, with a unique constraint on
  `(user_id, store_id)` so a user can only have one active rating per
  store (updating a rating overwrites the existing row instead of adding
  a new one)

Full definitions are in `backend/sql/schema.sql`.

---

## Future Improvements

A few things that would take this from "assignment ready" to
"production ready":

- Move the JWT out of `localStorage` into an httpOnly cookie
- Add pagination on the users and stores tables instead of loading everything at once
- Allow a store owner to be linked to more than one store
- Add a forgot-password flow with email verification
- Write automated tests for the API routes and form validations
- Add proper request rate limiting on the login and signup endpoints
- Deploy with CI/CD instead of manual builds

---
### Author
Khushi Samundre
