import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const mockTransactions = [
  { id: 1, date: "2026-03-01", amount: 150000, category: "Tech Mahindra Salary", type: "income", status: "Completed", paymentMethod: "Bank Transfer" },
  { id: 2, date: "2026-03-03", amount: 4500, category: "Zomato", type: "expense", status: "Completed", paymentMethod: "UPI" },
  { id: 3, date: "2026-03-06", amount: 12000, category: "Rent", type: "expense", status: "Completed", paymentMethod: "Bank Transfer" },
  { id: 4, date: "2026-03-10", amount: 850, category: "Uber", type: "expense", status: "Completed", paymentMethod: "Cash" },
  { id: 5, date: "2026-03-12", amount: 25000, category: "Freelance", type: "income", status: "Completed", paymentMethod: "UPI" },
  { id: 6, date: "2026-03-15", amount: 3500, category: "D-Mart Groceries", type: "expense", status: "Completed", paymentMethod: "Card" },
  { id: 7, date: "2026-03-18", amount: 1200, category: "Netflix & Spotify", type: "expense", status: "Completed", paymentMethod: "Cash" },
  { id: 8, date: "2026-03-21", amount: 8500, category: "Flight", type: "expense", status: "Completed", paymentMethod: "Card" },
  { id: 9, date: "2026-03-25", amount: 15000, category: "Stock Dividend", type: "income", status: "Completed", paymentMethod: "Bank Transfer" },
  { id: 10, date: "2026-03-28", amount: 2000, category: "Electricity Bill", type: "expense", status: "Completed", paymentMethod: "UPI" },
  { id: 11, date: "2026-03-31", amount: 5000, category: "Restaurant", type: "expense", status: "Completed", paymentMethod: "Cash" },
  { id: 12, date: "2026-04-01", amount: 150000, category: "Tech Mahindra Salary", type: "income", status: "Completed", paymentMethod: "Bank Transfer" },
];

const loadTransactions = () => {
  const saved = localStorage.getItem('transactions_data');
  return saved ? JSON.parse(saved) : mockTransactions;
};

const savedRole = localStorage.getItem('user_role') || 'admin';

const initialState = {
  data: loadTransactions(),
  role: savedRole, 
  searchQuery: '',
  status: 'idle',
  activeTab: 'Dashboard',
  isSidebarOpen: false, 
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(); // Just wait 1.5s to simulate API
      }, 1500);
    });
  }
);

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      if (state.role === 'admin') {
        state.data.unshift(action.payload);
        localStorage.setItem('transactions_data', JSON.stringify(state.data));
      }
    },
    deleteTransaction: (state, action) => {
      if (state.role === 'admin') {
        state.data = state.data.filter(t => t.id !== action.payload);
        localStorage.setItem('transactions_data', JSON.stringify(state.data));
      }
    },
    editTransaction: (state, action) => {
      if (state.role === 'admin') {
        const index = state.data.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
          localStorage.setItem('transactions_data', JSON.stringify(state.data));
        }
      }
    },
    setRole: (state, action) => {
      state.role = action.payload;
      localStorage.setItem('user_role', action.payload);
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
      // Close sidebar when a tab is selected on mobile
      state.isSidebarOpen = false;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTransactions.fulfilled, (state) => {
        state.status = 'succeeded';
      });
  }
});

export const { 
  addTransaction, 
  deleteTransaction, 
  editTransaction, 
  setRole, 
  setSearchQuery, 
  setActiveTab,
  toggleSidebar,
  setSidebarOpen
} = transactionsSlice.actions;
export default transactionsSlice.reducer;
