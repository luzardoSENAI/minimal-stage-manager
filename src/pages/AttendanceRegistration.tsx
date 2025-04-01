
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from '@/components/Header';
import DateRangePicker from '@/components/DateRangePicker';
import { DateRange, User } from '@/types';
import { startOfWeek, endOfWeek } from 'date-fns';
import { toast } from 'sonner';

const AttendanceRegistration = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  
  // Configure default date range for the current week
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Start on Monday
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // End on Sunday
  
  const [dateRange, setDateRange] = useState<DateRange>({
    from: weekStart,
    to: weekEnd,
  });

  React.useEffect(() => {
    // Check if user exists in location state
    const locationUser = location.state?.user;
    
    if (locationUser) {
      setUser(locationUser);
    } else {
      // Check if there's user information in localStorage
      const storedRole = localStorage.getItem('userRole');
      const storedName = localStorage.getItem('userName');
      
      if (storedRole && storedName) {
        setUser({
          id: '1',
          name: storedName,
          role: storedRole as 'student' | 'school' | 'company',
        });
      } else {
        // Redirect to login if no user
        navigate('/');
      }
    }
  }, [navigate]);

  const handleRegister = () => {
    if (!dateRange.from || !dateRange.to) {
      toast.error('Selecione o período inicial e final');
      return;
    }

    // Here we would typically save the registered attendance
    toast.success('Frequência registrada com sucesso!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header user={user} />
      
      <main className="container py-8">
        <div className="mb-8 space-y-2">
          <h1 className="text-2xl font-bold">Cadastro de Frequência</h1>
          <p className="text-muted-foreground">
            Cadastre a frequência para o período selecionado
          </p>
        </div>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-6">
              <div>
                <h2 className="text-lg font-medium mb-2">Selecione o período</h2>
                <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  Cancelar
                </Button>
                <Button onClick={handleRegister}>
                  Cadastrar Frequência
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AttendanceRegistration;
