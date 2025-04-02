
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CalendarClock } from "lucide-react";
import Header from '@/components/Header';
import DateRangePicker from '@/components/DateRangePicker';
import StudentSelector from '@/components/StudentSelector';
import { DateRange, User, AttendanceRecord } from '@/types';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isWeekend } from 'date-fns';
import { toast } from 'sonner';
import { mockStudents } from './Dashboard';

const AttendanceRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedStudentsIds, setSelectedStudentsIds] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState<'single' | 'multiple' | 'all'>('single');
  
  // Configure default date range for the current week
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Start on Monday
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // End on Sunday
  
  const [dateRange, setDateRange] = useState<DateRange>({
    from: weekStart,
    to: weekEnd,
  });

  // Estado para controle do carregamento
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
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

    // Redirect students as they cannot register attendance
    const currentRole = locationUser?.role || localStorage.getItem('userRole');
    if (currentRole === 'student') {
      toast.error('Alunos não podem cadastrar frequência');
      navigate('/dashboard');
    }
  }, [navigate, location]);

  const handleRegister = async () => {
    if (!dateRange.from || !dateRange.to) {
      toast.error('Selecione o período inicial e final');
      return;
    }

    let studentsToProcess: typeof mockStudents = [];

    if (selectionMode === 'all') {
      studentsToProcess = mockStudents;
    } else if (selectionMode === 'single' && selectedStudentId) {
      const selectedStudent = mockStudents.find(student => student.id === selectedStudentId);
      if (selectedStudent) {
        studentsToProcess = [selectedStudent];
      } else {
        toast.error('Aluno não encontrado');
        return;
      }
    } else if (selectionMode === 'multiple' && selectedStudentsIds.length > 0) {
      studentsToProcess = mockStudents.filter(student => selectedStudentsIds.includes(student.id));
    } else {
      toast.error('Selecione pelo menos um aluno');
      return;
    }

    if (studentsToProcess.length === 0) {
      toast.error('Nenhum aluno selecionado');
      return;
    }

    setIsRegistering(true);

    try {
      // Generate attendance records for each day in the date range
      const daysInRange = eachDayOfInterval({
        start: dateRange.from,
        end: dateRange.to,
      });

      // Filter out weekends
      const workDays = daysInRange.filter(day => !isWeekend(day));
      
      // Create attendance records for each student
      const newAttendanceRecords: AttendanceRecord[] = [];
      
      studentsToProcess.forEach(student => {
        workDays.forEach((day, dayIndex) => {
          newAttendanceRecords.push({
            id: `new-${Date.now()}-${student.id}-${dayIndex}`,
            studentId: student.id,
            studentName: student.name,
            date: format(day, 'yyyy-MM-dd'),
            isPresent: true,
            checkInTime: '08:00',
            checkOutTime: '12:00',
          });
        });
      });

      // Store the new attendance records in localStorage
      const existingRecords = localStorage.getItem('attendanceRecords');
      const allRecords = existingRecords 
        ? [...JSON.parse(existingRecords), ...newAttendanceRecords] 
        : newAttendanceRecords;
      
      localStorage.setItem('attendanceRecords', JSON.stringify(allRecords));

      toast.success(`Frequência registrada com sucesso para ${studentsToProcess.length} aluno(s)!`);
      navigate('/dashboard', { state: { user, newAttendanceRecords } });
    } catch (error) {
      toast.error('Erro ao registrar frequência');
      console.error('Erro ao registrar frequência:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header user={user} />
      
      <main className="container max-w-4xl py-8">
        <div className="mb-8 space-y-2">
          <h1 className="text-2xl font-bold">Cadastro de Frequência</h1>
          <p className="text-muted-foreground">
            Cadastre a frequência para o período selecionado
          </p>
        </div>

        <Alert className="mb-6">
          <CalendarClock className="h-4 w-4" />
          <AlertTitle>Lembrete de permissões</AlertTitle>
          <AlertDescription>
            Escolas podem marcar presença apenas às segundas e terças-feiras.
            Empresas podem marcar presença apenas às quartas, quintas e sextas-feiras.
          </AlertDescription>
        </Alert>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-medium mb-4">Selecione o(s) aluno(s)</h2>
                  <StudentSelector 
                    students={mockStudents} 
                    selectedStudentId={selectedStudentId} 
                    setSelectedStudentId={setSelectedStudentId}
                    selectedStudentsIds={selectedStudentsIds}
                    setSelectedStudentsIds={setSelectedStudentsIds}
                    selectionMode={selectionMode}
                    setSelectionMode={setSelectionMode}
                  />
                </div>
                
                <div>
                  <h2 className="text-lg font-medium mb-4">Selecione o período</h2>
                  <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleRegister} 
                  disabled={isRegistering}
                >
                  {isRegistering ? 'Cadastrando...' : 'Cadastrar Frequência'}
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
