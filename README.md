# ArthSense - Premium Finance Dashboard

ArthSense is an elite, intuitive finance dashboard built as part of a frontend evaluation. It demonstrates clean architecture, "Antigravity" design principles (glassmorphism, floating elements, spatial UI), and robust state management without requiring a backend.

## 🚀 Live Environment Setup

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Clone / Navigate to this project folder.
2. Ensure you are in the `webapp` directory:
   ```bash
   cd webapp
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the interactive development server:
   ```bash
   npm run dev
   ```
   **The app will be available locally, usually at `http://localhost:5173`.**

## 🎨 Design System & Approach

This project is styled heavily adhering to the `Antigravity UI` principles:
- **Glassmorphism:** Leveraging intensive `backdrop-blur` UI styling (`.glass` utilities).
- **Smoothness:** Utilizing GSAP logic for scroll-triggered staggers and Framer Motion for interactive spring transitions.
- **Responsiveness:** A fully scalable dashboard utilizing TailwindCSS Flexbox/Grid natively. 
- **Dark Mode Context:** Complete CSS variable support enforcing clean light/dark modes switched securely via Redux.

## 🛠️ Technology Stack

- **Framework:** React + Vite
- **Styling:** TailwindCSS (v3) + PostCSS
- **State Management:** Redux Toolkit (with LocalStorage Data Persistence Middleware)
- **Charts:** Recharts
- **Animations:** Framer Motion + GSAP
- **Icons:** PrimeIcons

## ⚡ Core Features

1. **Dashboard Overview:** Dynamic Cards representing Total Balance, Total Income, and Total Expenses updated instantly.
2. **Visual Analytics:** Interactive Recharts elements showing layered area trends and category breakdown.
3. **Transaction Management:**
   - Add, Edit, Delete transactions through cleanly animated Modal popovers.
   - Live Sorting (by newest, oldest, highest amount, lowest amount).
   - Category filtering and Live UI Search.
4. **Insights Engine:** Derived statistical tracking recognizing highest expenditures natively from state.
5. **Role-Based Testing Environment:**
   - Toggling state between "Viewer" and "Admin" conditionally renders structural UI changes (e.g. Viewer cannot add or edit).
6. **Data Portability:** 
   - State persists gracefully to `localStorage` ensuring an uninterrupted mocked session.
   - Generate and download raw `.csv` data representing your current transaction table simply by hitting "Export Report".

## 📁 Architecture Overview

Clean, scalable folder hierarchy:
```text
src/
 ├── components/
 │    ├── dashboard/      (Cards & Chart Logic)
 │    ├── insights/       (Derived Analytics Component)
 │    ├── layout/         (Sidebar & Navbar Structural Shells)
 │    └── transactions/   (Core List & Admin Modification Modals)
 ├── pages/
 │    └── Dashboard.jsx   (Main view coordinating GSAP mount animations)
 ├── redux/
 │    ├── store.js        (Centralized state container + LocalStorage middleware)
 │    ├── themeSlice.js
 │    └── transactionsSlice.js
 ├── App.jsx              (Global layout wrapper & configuration)
 └── index.css            (PostCSS base containing glassmorphism variables)
```

## 🧠 Conclusion

This architecture isolates complexities where needed, allowing scaling and easy maintenance. The integration of high-fidelity animations makes data tracking a rewarding user experience, all working client-side effectively mapping the PRD requirements cleanly and securely.
