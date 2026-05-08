## 🚀 Coderoom | Real-Time Collaborative IDE
Coderoom is a high-performance, full-stack collaborative code editor that allows multiple developers to write, share, and execute code in real-time. Built with a focus on seamless synchronization and low-latency execution, it brings a "Google Docs" experience to coding.

✨ Features
Real-Time Collaboration: Multiple users can edit the same file simultaneously with live cursor tracking.

Conflict Resolution: Powered by Yjs and CRDTs to ensure zero data loss during concurrent edits.

Multi-Language Execution: Supports instant execution for JavaScript and Python.

Persistent Storage: Save your progress and resume later, with data safely stored in MongoDB.

Responsive UI: A sleek, dark-themed interface built with Tailwind CSS, optimized for all screen sizes.

Secure Auth: Token-based authentication handshake to manage private room access.

🛠️ Tech Stack

Frontend
Framework: Next.js 15 (App Router)

Editor: CodeMirror 6

Collaboration: Liveblocks & Yjs

Styling: Tailwind CSS & ShadCN UI

Backend
Runtime: Node.js

Framework: Express.js

Database: MongoDB Atlas

Deployment: Render (Backend) & Vercel (Frontend)

🚀 Getting Started
1. Clone the Repositories
Bash
# Clone Frontend
git clone https://github.com/Rohitt0/coderoom.git

# Clone Backend
git clone https://github.com/Rohitt0/coderoom-server.git
2. Environment Setup
Create a .env file in both directories:

Frontend (.env.local):

Code snippet
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=your_key
NEXT_PUBLIC_SERVER_URL=https://coderoom-server-mvba.onrender.com
Backend (.env):

Code snippet
MONGO_URI=your_mongodb_connection_string
LIVEBLOCKS_SECRET_KEY=your_secret_key
PORT=5000
3. Install & Run
Bash
# In both folders
npm install
npm run dev # Frontend
node server.js # Backend
🧠 How it Works
Synchronization: When a user types, Yjs captures the change and broadcasts it through Liveblocks WebSockets.

Auth Handshake: The frontend requests a secure session token from the Express server, which validates the request using the Liveblocks Secret Key.

Persistence: The editor state is periodically synced with MongoDB, allowing users to reload rooms without losing their code.
