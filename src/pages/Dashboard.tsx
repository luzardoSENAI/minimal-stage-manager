
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import AttendanceTable from '@/components/AttendanceTable';
import DateRangePicker from '@/components/DateRangePicker';
import ExportButton from '@/components/ExportButton';
import { Card, CardContent } from '@/components/ui/card';
import { AttendanceRecord, DateRange, User } from '@/types';

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

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>(mockAttendanceData);
  const [filteredData, setFilteredData] = useState<AttendanceRecord[]>(mockAttendanceData);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    // Verificar se o usuário existe no state da localização
    const locationUser = location.state?.user;
    
    if (locationUser) {
      setUser(locationUser);
    } else {
      // Verificar se existe informação do usuário no localStorage
      const storedRole = localStorage.getItem('userRole');
      const storedName = localStorage.getItem('userName');
      
      if (storedRole && storedName) {
        setUser({
          id: '1',
          name: storedName,
          role: storedRole as UserRole,
        });
      } else {
        // Redirecionar para login se não existir usuário
        navigate('/');
      }
    }
  }, [location, navigate]);

  useEffect(() => {
    // Filtrar dados com base no intervalo de datas
    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      
      const filtered = attendanceData.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= fromDate && recordDate <= toDate;
      });
      
      setFilteredData(filtered);
    } else {
      setFilteredData(attendanceData);
    }
  }, [dateRange, attendanceData]);

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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
              <ExportButton data={filteredData} dateRange={dateRange} />
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
