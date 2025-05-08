
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  userType: 'student' | 'school' | 'company';
  userName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ userType, userName }) => {
  const location = useLocation();
  
  // Define profile picture based on user type
  let profilePic = '/public/lovable-uploads/4427cfa2-8dee-45d6-9a5d-8ac632ef09cc.png';
  if (userType === 'student') {
    profilePic = '/public/lovable-uploads/4427cfa2-8dee-45d6-9a5d-8ac632ef09cc.png';
  } else if (userType === 'school' || userType === 'company') {
    profilePic = '/public/lovable-uploads/8cf02ac2-1c0d-4708-b971-18ceaa539b9b.png';
  }

  // Define label for user type
  let userLabel = '';
  switch (userType) {
    case 'student':
      userLabel = 'Aluno';
      break;
    case 'school':
      userLabel = 'Escola';
      break;
    case 'company':
      userLabel = 'Empresa';
      break;
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={profilePic} alt="Perfil" className="profile-picture" />
      </div>
      
      <nav className="sidebar-menu">
        <Link to="/" className={`menu-item ${location.pathname === '/' ? 'active' : ''}`}>
          <span className="menu-item-icon">🏠</span>
          <span className="menu-item-text">Início</span>
        </Link>
        
        <Link to="/dashboard" className={`menu-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          <span className="menu-item-icon">📊</span>
          <span className="menu-item-text">Dashboard</span>
        </Link>
        
        <Link to="/settings" className={`menu-item ${location.pathname === '/settings' ? 'active' : ''}`}>
          <span className="menu-item-icon">⚙️</span>
          <span className="menu-item-text">Configurações</span>
        </Link>
      </nav>
      
      <div className="sidebar-footer">
        <div className="mb-2">EstágioS - {userLabel}</div>
        <a href="#" className="footer-link">Suporte & Ajuda</a>
        <a href="#" className="footer-link">Termos & Serviços</a>
      </div>
    </div>
  );
};

export default Sidebar;
