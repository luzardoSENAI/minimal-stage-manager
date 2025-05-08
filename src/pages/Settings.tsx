
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { UserRole } from '@/types';

const Settings = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [userName, setUserName] = useState<string>('Aluno');

  useEffect(() => {
    // Load role from localStorage
    const roleFromStorage = localStorage.getItem('userRole');
    
    if (roleFromStorage) {
      setUserRole(roleFromStorage as UserRole);
    } else {
      // Redirect to login if no role found
      navigate('/');
    }

    // Set user name based on role
    if (roleFromStorage === 'student') {
      setUserName('Carlos Silva');
    } else if (roleFromStorage === 'school') {
      setUserName('Escola Técnica Federal');
    } else if (roleFromStorage === 'company') {
      setUserName('Empresa ABC Tecnologia');
    }
  }, [navigate]);

  return (
    <div className="app-container">
      <Sidebar userType={userRole} userName={userName} />

      <div className="main-content">
        <div className="content-header">
          <h1 className="header-title">Configurações</h1>
        </div>

        <div className="content-body">
          <div className="max-w-2xl mx-auto">
            <button className="settings-btn">
              <span className="settings-icon">👤</span>
              <span className="settings-text">Editar Informações</span>
            </button>

            <button className="settings-btn">
              <span className="settings-icon">🔒</span>
              <span className="settings-text">Privacidade e Segurança</span>
            </button>

            <button className="settings-btn">
              <span className="settings-icon">🏢</span>
              <span className="settings-text">Informações da Empresa</span>
            </button>

            <button className="settings-btn">
              <span className="settings-icon">🌐</span>
              <span className="settings-text">Idioma e Região</span>
            </button>

            <button className="settings-btn">
              <span className="settings-icon">🎨</span>
              <span className="settings-text">Tema e Aparência</span>
            </button>

            <button className="settings-btn">
              <span className="settings-icon">👥</span>
              <span className="settings-text">Gerenciar Tarefas</span>
            </button>

            <button className="settings-btn">
              <span className="settings-icon">✉️</span>
              <span className="settings-text">Verificação de E-mail</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
