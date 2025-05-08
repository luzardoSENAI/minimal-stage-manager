
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import AttendanceRegistration from './pages/AttendanceRegistration';
import NotFound from './pages/NotFound';
import Reports from './pages/Reports';
import Evaluations from './pages/Evaluations';
import Students from './pages/Students';
import Profile from './pages/Profile';
import AddStudent from './pages/AddStudent';
import Login from './pages/Login';
import { initializeMockData } from './utils/fileStorage';

// Create a client
const queryClient = new QueryClient();

const App = () => {
  // Initialize mock data when the app starts
  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/attendance-registration" element={<AttendanceRegistration />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/evaluations" element={<Evaluations />} />
          <Route path="/students" element={<Students />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-student" element={<AddStudent />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
