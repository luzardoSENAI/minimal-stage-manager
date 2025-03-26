
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subDays, format, parseISO, addDays } from 'date-fns';
import { AttendanceRecord, DateRange, UserRole } from '@/types';
import { toast } from 'sonner';
import Header from '../components/Header';
import AttendanceTable from '../components/AttendanceTable';
import DateRangePicker from '../components/DateRangePicker';
import ExportButton from '../components/ExportButton';

// Mock data generator
const generateMockData = (): AttendanceRecord[] => {
  const today = new Date();
  const mockData: AttendanceRecord[] = [];
  
  // Generate mock attendance records for the last 14 days
  for (let i = 14; i >= 0; i--) {
    const date = subDays(today, i);
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    mockData.push({
      id: `record-${date.toISOString()}`,
      studentId: 'student-1',
      studentName: 'Carlos Silva',
      date: date.toISOString(),
      isPresent: Math.random() > 0.2, // 80% chance of being present
      checkInTime: '08:00',
      checkOutTime: '17:00',
    });
  }
  
  return mockData;
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [allAttendanceData, setAllAttendanceData] = useState<AttendanceRecord[]>([]);
  const [filteredAttendanceData, setFilteredAttendanceData] = useState<AttendanceRecord[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  useEffect(() => {
    // Check if user is logged in
    const storedRole = localStorage.getItem('userRole') as UserRole | null;
    const storedName = localStorage.getItem('userName');
    
    if (!storedRole || !storedName) {
      toast.error('Sessão expirada. Faça login novamente');
      navigate('/');
      return;
    }
    
    setUserRole(storedRole);
    setUserName(storedName);
    
    // Initialize with mock data
    const mockData = generateMockData();
    setAllAttendanceData(mockData);
  }, [navigate]);

  useEffect(() => {
    // Filter data based on date range
    if (dateRange.from && dateRange.to) {
      const filtered = allAttendanceData.filter(record => {
        const recordDate = parseISO(record.date);
        // Add one day to include the end date in the range
        const adjustedEndDate = addDays(dateRange.to!, 1);
        return recordDate >= dateRange.from! && recordDate < adjustedEndDate;
      });
      
      setFilteredAttendanceData(filtered);
    } else {
      setFilteredAttendanceData(allAttendanceData);
    }
  }, [dateRange, allAttendanceData]);

  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header userName={userName} userRole={userRole} />
      
      <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Controle de Frequência</h1>
          <p className="text-muted-foreground">
            {userRole === 'student' 
              ? 'Visualize seu registro de frequência'
              : userRole === 'school'
                ? 'Gerencie a frequência dos alunos (Segunda e Terça)'
                : 'Gerencie a frequência dos estagiários (Quarta a Sexta)'}
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
            <DateRangePicker date={dateRange} setDate={setDateRange} />
            
            <div className="flex items-center space-x-3">
              <ExportButton data={filteredAttendanceData} format="pdf" />
              <ExportButton data={filteredAttendanceData} format="xlsx" />
            </div>
          </div>
          
          <AttendanceTable 
            attendanceData={filteredAttendanceData} 
            userRole={userRole}
            setAttendanceData={(updatedData) => {
              // Update filtered data
              setFilteredAttendanceData(updatedData);
              
              // Also update the main data source
              const updatedRecord = updatedData.find((record, index) => 
                record.isPresent !== filteredAttendanceData[index]?.isPresent
              );
              
              if (updatedRecord) {
                setAllAttendanceData(prevData => 
                  prevData.map(record => 
                    record.id === updatedRecord.id 
                      ? updatedRecord 
                      : record
                  )
                );
              }
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
