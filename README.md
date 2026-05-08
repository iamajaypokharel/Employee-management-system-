# Greenfield Staff Portal

This workspace now contains a React frontend and a Node/Express backend.

## Structure

- `client/` - React app built with Vite
- `server/` - Node backend with Express API

## Setup

1. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

2. Install frontend dependencies:
   ```bash
   cd ../client
   npm install
   ```

## Run locally

1. Start the backend:
   ```bash
   cd server
   npm run start
   ```

2. Start the frontend:
   ```bash
   cd client
   npm run dev
   ```

3. Open the URL shown by Vite (usually `http://localhost:3000`). The frontend proxies `/api` requests to `http://localhost:4000`.

## Features

- Add and edit employee records
- Delete employee records
- Search and filter employees by department and role
- Responsive layout for mobile and desktop
- Backend messages retrieved from `/api/messages`
- Data persistence in server memory while the server is running
