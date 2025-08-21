# SkillSwap

SkillSwap is a full-stack platform where users can **exchange knowledge and skills**.  
For example, someone might offer violin lessons in return for help with web development.

This app enables users to post skill offerings or requests, connect through real-time chat, and manage their profiles.

You can Sign Up with invalid email.

---

## ✨ Features

- ✅ Full user authentication (sign up, log in, password update)
- 📝 Create, edit, sort and delete skill exchange posts
- 💬 Real-time 1-on-1 messaging with Supabase subscriptions
- 🧑‍💻 View and message other users' profiles
- ⚙️ Update your own profile: bio, skills offered, profile picture, and password
- 🌟 Ratings and reviews between users

---

## 🛠 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **State Management:** Context API, React Query
- **Backend as a Service:** Supabase (auth, database, real-time)
- **Other Tools:** react-hot-toast , Git

---

## 🚧 Project Status

This project is functional but still in development:

- 🔧 **Styling** is in progress (UI/UX not final)
- ⚠️ **Error handling** is basic — alerts will be replaced with `react-hot-toast`

---

## ⚙️ Getting Started

To run the project locally:

1. Clone this repository
2. Create a project at [Supabase](https://supabase.com/)
3. Create a `.env.local` file in the root directory with the following:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```
