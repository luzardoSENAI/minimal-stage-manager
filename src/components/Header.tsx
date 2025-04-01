
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { User } from '@/types';

interface HeaderProps {
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
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
    <header className="w-full bg-background border-b border-border px-6 py-3 flex justify-between items-center sticky top-0 z-10 backdrop-blur-sm">
      <Logo />
      
      {user && (
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <div className="text-right mr-2">
            <p className="font-medium text-sm">{user.name}</p>
            <p className="text-xs text-muted-foreground">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                {getRoleLabel(user.role)}
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
      )}
    </header>
  );
};

export default Header;
