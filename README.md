# 🌿 AgriWise AI — AI-Powered Agriculture Crop Advisory Assistant

[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20TypeScript%20%7C%20Express%20%7C%20Supabase-22c55e?style=for-the-badge)](https://github.com)
[![AI Engine](https://img.shields.io/badge/AI-Google%20Gemini%202.5%20Flash-4285F4?style=for-the-badge)](https://ai.google.dev)
[![UI System](https://img.shields.io/badge/Design-Glassmorphism%20Stripe%2FLinear-10B981?style=for-the-badge)](https://tailwindcss.com)

**AgriWise AI** is a production-ready, full-stack SaaS application that generates custom agronomic strategies based on farm soil profiles, land acreage, regional climate data, and operational budgets.

---

## 🌟 Key Features & Architecture

- **Precision Gemini AI Advisory Engine**: Formulates soil enrichment, Integrated Pest Management (IPM), and precision drip irrigation plans strictly validated via Zod schemas.
- **Glassmorphism UI System**: Premium dark-mode UI with smooth gradients, animated SVG viability gauge wheels, and responsive cards.
- **Multi-Plot Farm Management**: CRUD farm profiles (Loam, Clay, Sandy, Silt, Peat, Chalk) with climate notes and region parameters.
- **Financial & ROI Analysis**: Displays cost breakdown per acre, projected yield increase percentages, and payback timeline metrics.
- **Print & PDF Export**: One-click printable agronomic advisory reports.
- **Supabase Auth & RLS**: Strict PostgreSQL Row Level Security policies (`auth.uid() = user_id`).

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, React Router DOM.
- **Backend**: Node.js, Express.js, `@google/generative-ai` SDK, `@supabase/supabase-js`, Zod, Cors, Helmet.
- **Database & Auth**: Supabase PostgreSQL with Row Level Security policies.

---

## ⚡ Quickstart & Local Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/agriwise-ai.git
cd agriwise-ai
npm run setup
```

### 2. Configure Environment Variables
Copy `.env.example` to `server/.env` and `client/.env`:

**`server/.env`**
```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
GEMINI_API_KEY=your-google-gemini-api-key
```

**`client/.env`**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=http://localhost:5000/api
```

### 3. Setup Database Schema
Paste and run the SQL script in [supabase/schema.sql](./supabase/schema.sql) in your Supabase SQL Editor.

### 4. Run Development Servers
```bash
# Run Express API (http://localhost:5000)
npm run dev:server

# Run React Frontend (http://localhost:5173)
npm run dev:client
```

---

## 📜 License
Licensed under the [MIT License](LICENSE).
