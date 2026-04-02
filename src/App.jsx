import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';

function App() {
  const themeMode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    // initialize theme
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}

export default App;
