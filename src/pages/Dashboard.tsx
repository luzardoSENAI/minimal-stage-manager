
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import AttendanceTable from '@/components/AttendanceTable';
import DateRangePicker from '@/components/DateRangePicker';
import ExportButton from '@/components/ExportButton';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
    // Check if user exists in location state
    const locationUser = location.state?.user;
    
    if (locationUser) {
      setUser(locationUser);
    } else {
      // Redirect to login if no user
      navigate('/');
    }
  }, [location, navigate]);

  useEffect(() => {
    // Filter data based on date range
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

  const handleAttendanceUpdate = (recordId: string, isPresent: boolean, notes?: string) => {
    setAttendanceData(prevData => {
      const newData = [...prevData];
      const recordIndex = newData.findIndex(record => record.id === recordId);
      
      if (recordIndex !== -1) {
        newData[recordIndex] = {
          ...newData[recordIndex],
          isPresent,
          notes: notes || newData[recordIndex].notes,
        };
      }
      
      return newData;
    });
  };

  const canEditRecord = (date: string) => {
    if (!user) return false;
    
    const day = new Date(date).getDay();
    
    // School can edit Monday (1) and Tuesday (2)
    if (user.role === 'school' && (day === 1 || day === 2)) {
      return true;
    }
    
    // Company can edit Wednesday (3), Thursday (4), and Friday (5)
    if (user.role === 'company' && (day === 3 || day === 4 || day === 5)) {
      return true;
    }
    
    return false;
  };

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
          data={filteredData}
          onUpdateAttendance={handleAttendanceUpdate}
          canEdit={canEditRecord}
          userRole={user?.role || 'student'}
        />
      </main>
    </div>
  );
};

export default Dashboard;
