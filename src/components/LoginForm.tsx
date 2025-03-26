
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const LoginForm: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const navigate = useNavigate();

  const handleRoleChange = (value: UserRole) => {
    setSelectedRole(value);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast.error('Por favor, selecione um tipo de usuário');
      return;
    }

    // Store user role in localStorage
    localStorage.setItem('userRole', selectedRole);
    localStorage.setItem('userName', getUserNameByRole(selectedRole));
    
    toast.success(`Login como ${getUserNameByRole(selectedRole)} realizado com sucesso!`);
    navigate('/dashboard');
  };

  const getUserNameByRole = (role: UserRole): string => {
    switch (role) {
      case 'student':
        return 'Carlos Silva';
      case 'school':
        return 'Escola Técnica Federal';
      case 'company':
        return 'Empresa ABC Tecnologia';
      default:
        return '';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Bem-vindo
        </CardTitle>
        <CardDescription>
          Selecione seu tipo de perfil para continuar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-6">
          <RadioGroup
            className="grid gap-4"
            value={selectedRole || ''}
            onValueChange={(value) => handleRoleChange(value as UserRole)}
          >
            <div className="flex items-center space-x-2 border p-4 rounded-md hover:border-primary transition-colors cursor-pointer">
              <RadioGroupItem value="student" id="student" className="border-primary" />
              <Label htmlFor="student" className="flex-1 cursor-pointer font-medium">Aluno</Label>
            </div>
            
            <div className="flex items-center space-x-2 border p-4 rounded-md hover:border-primary transition-colors cursor-pointer">
              <RadioGroupItem value="school" id="school" className="border-primary" />
              <Label htmlFor="school" className="flex-1 cursor-pointer font-medium">Escola</Label>
            </div>
            
            <div className="flex items-center space-x-2 border p-4 rounded-md hover:border-primary transition-colors cursor-pointer">
              <RadioGroupItem value="company" id="company" className="border-primary" />
              <Label htmlFor="company" className="flex-1 cursor-pointer font-medium">Empresa</Label>
            </div>
          </RadioGroup>
          
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-white"
            disabled={!selectedRole}
          >
            Continuar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
