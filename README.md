# ArthSense - Finance Dashboard UI Implementation

## 1. Introduction & Objective
**ArthSense** is a high-fidelity, obsidian-themed finance dashboard built to fulfill the "Finance Dashboard UI" implementation challenge. The primary objective of this project is to demonstrate excellence in:
- **Clean UI/UX Design**: Modular, readable, and aesthetic obsidian-dark interface.
- **Component Architecture**: Reusable and scalable frontend structure.
- **State Management**: Robust handling of complex data flows.
- **Data Visualization**: Clear, interactive financial insights via modern charting.

---

## 2. Tech Stack Selection
| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | **React 18 (Vite)** | Industry standard for component-based SPAs with lightning-fast development (HMR). |
| **Styling** | **Tailwind CSS** | Utility-first approach for rapid, consistent, and highly-customizable UI development. |
| **State Mgmt** | **Redux Toolkit** | Centralized, predictable state management for transactions, roles, and UI preferences. |
| **Charts** | **Recharts** | Composability and ease of use for creating responsive, accessible data visualizations. |
| **Icons** | **PrimeIcons & Lucide** | Comprehensive, modern icon set for professional look & feel. |
| **Animations** | **Framer Motion** | Industry-leading library for smooth, physics-based micro-interactions. |

---

## 3. Core Features

### 🔹 Dashboard Overview
- **Summary Cards**: Displays Total Balance, Income, and Expenses with monthly comparison trend indicators.
- **Balance Trend**: Interactive line chart visualizing financial trajectory.
- **Category Breakdown**: Categorical insights via an aesthetic Treemap/Donut hybrid.

### 🔹 Transactions Section
- **Unified List**: Comprehensive table/card view including Date, Amount, Category, Type, and Status.
- **Smart Pagination**: 10-item-per-page logic with automatic layout balancing.
- **Management**: Full CRUD (Add/Edit/Delete) capabilities for Admin users via a glassmorphism modal.
- **Filtering & Search**: Instant real-time search by category and type-based toggles.

### 🔹 Role-Based UI (RBAC Simulation)
- **Admin Role**: Full access to financial records including creation, modification, and deletion.
- **Viewer Role**: Read-only access; administrative buttons (Edit/Delete/Add) are hidden to maintain data integrity.
- **Global Toggle**: Ability to switch roles instantly via the Navigation bar.

### 🔹 Insights Section
- **Dynamic Analysis**: Automatically calculates the "Highest Spending Category" and "Total Volume".
- **Observations**: Provides context-aware highlights based on current transaction data.

---

## 4. Project Architecture
The project follows a **Scalable Modular Structure**, separating concerns into isolated, reusable units:

```text
src/
├── components/
│   ├── common/       # Reusable UI (Buttons, Dropdowns, DatePickers)
│   ├── dashboard/    # Overview-specific modules (Summary, Charts)
│   ├── transactions/ # Unified list, modals, and pagination
│   └── insights/     # Derived data analysis panels
├── redux/            # Store configuration and Slices (Transactions, Theme)
├── pages/            # View-level assembly (Main Dashboard)
├── styles/           # Global CSS and Tailwind configurations
└── utils/            # Calculation logic and formatters
```

---

## 5. Setup & Installation

1. **Clone & Navigate**:
   ```bash
   git clone https://github.com/Aman-Bahuguna/Finance-Dashboard-UI-Zorvyn-.git
   cd webapp
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Development Run**:
   ```bash
   npm run dev
   ```

4. **Production Build**:
   ```bash
   npm run build
   ```

---

## 6. Optional Enhancements (Implemented)
To strengthen the submission, the following advanced features were added:
- **Experimental Theme Animations**: Integrated browser **View Transition API** for a cinematic "circular reveal" effect when switching themes.
- **Data Persistence**: Full synchronization with **LocalStorage** to keep data consistent across refreshes.
- **Export Logic**: One-click **CSV Generation** for financial reports.
- **Obsidian Dark Mode**: Custom-crafted, premium dark theme optimized for high-fidelity displays.
- **Pagination System**: Built-in paging to optimize dashboard vertical space.

---

## 7. Conclusion
ArthSense avoids the "messy complexity" pitfall by focusing on high-quality code structure and intuitive design. It demonstrates how a simple project can look premium and feel scalable with the right architectural decisions.
