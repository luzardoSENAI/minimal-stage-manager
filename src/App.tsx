
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

const App = () => {
  return (
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
  );
};

export default App;
