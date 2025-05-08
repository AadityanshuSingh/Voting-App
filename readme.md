# Real-Time Voting App

A minimal real-time voting app built with **React**, **Chakra UI**, **Node.js**, and **WebSocket**. This app allows users to create voting rooms, vote in real-time, and see live updates of results — all without a database. Everything runs in-memory.

---

## Features

- Create a room with a question and two voting options
- View all active rooms from a dropdown
- Cast a vote (Option A or B)
- Real-time vote updates for all connected users
- Client-side restriction: vote only once per room

---

**Frontend:**

- React
- Chakra UI
- WebSocket API

**Backend:**

- Node.js
- Express
- ws (WebSocket library)

---

```bash
git clone https://github.com/yourusername/realtime-voting-app.git
cd client/realtime-voting-app
```

**Install Dependencies(Frontend)**
cd client/vote-app-frontend
npm install
npm run dev

**Install Dependencies(Backend)**
cd server
npm install
npm start
