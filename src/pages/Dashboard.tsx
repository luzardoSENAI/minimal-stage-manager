
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { startOfWeek, endOfWeek } from 'date-fns';
import Header from '@/components/Header';
import AttendanceTable from '@/components/AttendanceTable';
import DateRangePicker from '@/components/DateRangePicker';
import ExportButton from '@/components/ExportButton';
import StudentSelector from '@/components/StudentSelector';
import AddStudentButton from '@/components/AddStudentButton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { AttendanceRecord, DateRange, User, UserRole } from '@/types';

// Mock data for attendance records
const mockAttendanceData: AttendanceRecord[] = [
  {
    id: '1',
    studentId: '101',
    studentName: 'Ana Silva',
    date: '2024-07-01', // Monday
    isPresent: true,
    checkInTime: '08:00',
    checkOutTime: '12:00',
  },
  {
    id: '2',
    studentId: '101',
    studentName: 'Ana Silva',
    date: '2024-07-02', // Tuesday
    isPresent: false,
    notes: 'Faltou por motivo de saúde',
  },
  {
    id: '3',
    studentId: '101',
    studentName: 'Ana Silva',
    date: '2024-07-03', // Wednesday
    isPresent: true,
    checkInTime: '08:00',
    checkOutTime: '12:00',
  },
  {
    id: '4',
    studentId: '102',
    studentName: 'Carlos Mendes',
    date: '2024-07-01', // Monday
    isPresent: true,
    checkInTime: '08:15',
    checkOutTime: '12:00',
  },
  {
    id: '5',
    studentId: '102',
    studentName: 'Carlos Mendes',
    date: '2024-07-02', // Tuesday
    isPresent: true,
    checkInTime: '08:00',
    checkOutTime: '12:00',
  },
  {
    id: '6',
    studentId: '102',
    studentName: 'Carlos Mendes',
    date: '2024-07-03', // Wednesday
    isPresent: false,
    notes: 'Faltou sem justificativa',
  },
];

// Lista de estudantes
export const mockStudents = [
  { id: '101', name: 'Ana Silva', company: 'Tech Solutions', contact: 'ana.silva@email.com' },
  { id: '102', name: 'Carlos Mendes', company: 'InnovaSoft', contact: 'carlos.mendes@email.com' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>(mockAttendanceData);
  const [filteredData, setFilteredData] = useState<AttendanceRecord[]>(mockAttendanceData);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  
  // Configurar o intervalo de datas para a semana atual por padrão
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Começa na segunda-feira
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Termina no domingo
  
  const [dateRange, setDateRange] = useState<DateRange>({
    from: weekStart,
    to: weekEnd,
  });

  useEffect(() => {
    console.log("Dashboard useEffect running");
    console.log("Location state:", location.state);
    
    // Verificar se o usuário existe no state da localização
    const locationUser = location.state?.user;
    
    if (locationUser) {
      console.log("Using user from location state:", locationUser);
      setUser(locationUser);
      
      // For student role, filter data for that student only
      if (locationUser.role === 'student') {
        // This is just a mock implementation using fixed IDs
        // In a real app, you'd use the actual student ID
        setSelectedStudentId('101'); // Setting to Ana Silva for demonstration
      }
    } else {
      // Verificar se existe informação do usuário no localStorage
      const storedRole = localStorage.getItem('userRole');
      const storedName = localStorage.getItem('userName');
      
      console.log("Using stored user data:", storedRole, storedName);
      
      if (storedRole && storedName) {
        const userObj = {
          id: '1',
          name: storedName,
          role: storedRole as UserRole,
        };
        setUser(userObj);
        
        // For student role, filter data for that student only
        if (storedRole === 'student') {
          // This is just a mock implementation using fixed IDs
          setSelectedStudentId('101'); // Setting to Ana Silva for demonstration
        }
      } else {
        // Redirecionar para login se não existir usuário
        console.log("No user data found, redirecting to login");
        navigate('/');
      }
    }
  }, [location, navigate]);

  useEffect(() => {
    // Filtrar dados com base no intervalo de datas e no estudante selecionado
    let filtered = attendanceData;
    
    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= fromDate && recordDate <= toDate;
      });
    }
    
    // Filtrar por estudante se houver um selecionado
    if (selectedStudentId) {
      filtered = filtered.filter(record => record.studentId === selectedStudentId);
    }
    
    setFilteredData(filtered);
  }, [dateRange, attendanceData, selectedStudentId]);

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header user={user} />
      
      <main className="container py-8">
        <div className="mb-8 space-y-2">
          <h1 className="text-2xl font-bold">Controle de Frequência</h1>
          <p className="text-muted-foreground">
            {user?.role === 'student' 
              ? 'Visualize seu histórico de frequência'
              : 'Gerencie a frequência dos estagiários'}
          </p>
        </div>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
                {user?.role !== 'student' && (
                  <StudentSelector 
                    students={mockStudents} 
                    selectedStudentId={selectedStudentId} 
                    setSelectedStudentId={setSelectedStudentId} 
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                {user?.role !== 'student' && <AddStudentButton />}
                {user?.role !== 'student' && (
                  <Button 
                    onClick={() => navigate('/attendance-registration', { state: { user } })}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Cadastrar Frequência
                  </Button>
                )}
                <ExportButton data={filteredData} dateRange={dateRange} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <AttendanceTable 
          attendanceData={filteredData}
          userRole={user?.role || 'student'}
          setAttendanceData={setAttendanceData}
        />
      </main>
    </div>
  );
};

export default Dashboard;
