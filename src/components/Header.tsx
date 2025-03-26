
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Logo from './Logo';

interface HeaderProps {
  userName: string;
  userRole: string;
}

const Header: React.FC<HeaderProps> = ({ userName, userRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    toast.success('Logout realizado com sucesso');
    navigate('/');
  };

  const getRoleLabel = (role: string): string => {
    switch (role) {
      case 'student':
        return 'Aluno';
      case 'school':
        return 'Escola';
      case 'company':
        return 'Empresa';
      default:
        return role;
    }
  };

  return (
    <header className="w-full bg-white border-b border-border px-6 py-3 flex justify-between items-center sticky top-0 z-10 backdrop-blur-sm bg-white/70">
      <Logo />
      
      <div className="flex items-center gap-4">
        <div className="text-right mr-2">
          <p className="font-medium text-sm">{userName}</p>
          <p className="text-xs text-muted-foreground">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              {getRoleLabel(userRole)}
            </span>
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLogout}
          className="text-sm"
        >
          Sair
        </Button>
      </div>
    </header>
  );
};

export default Header;
