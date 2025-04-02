import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { startOfWeek, endOfWeek, parseISO } from 'date-fns';
import Header from '@/components/Header';
import AttendanceTable from '@/components/AttendanceTable';
import DateRangePicker from '@/components/DateRangePicker';
import ExportButton from '@/components/ExportButton';
import StudentSelector from '@/components/StudentSelector';
import AddStudentButton from '@/components/AddStudentButton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AttendanceRecord, DateRange, User, UserRole } from '@/types';
import { loadAttendanceRecords, loadStudents, saveAttendanceRecords } from '@/utils/fileStorage';

// Mock data for attendance records as fallback
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

// Lista de estudantes como fallback
export const mockStudents = [
  { id: '101', name: 'Ana Silva', company: 'Tech Solutions', contact: 'ana.silva@email.com' },
  { id: '102', name: 'Carlos Mendes', company: 'InnovaSoft', contact: 'carlos.mendes@email.com' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [filteredData, setFilteredData] = useState<AttendanceRecord[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedStudentForRegistration, setSelectedStudentForRegistration] = useState<string | null>(null);
  const [selectedStudentsIds, setSelectedStudentsIds] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState<'single' | 'multiple' | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<typeof mockStudents>([]);

  // Configurar o intervalo de datas para a semana atual por padrão
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Começa na segunda-feira
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Termina no domingo

  const [dateRange, setDateRange] = useState<DateRange>({
    from: weekStart,
    to: weekEnd,
  });

  useEffect(() => {
    // Load data from text files
    const loadData = async () => {
      try {
        // Load attendance records
        const records = await loadAttendanceRecords();
        if (records && records.length > 0) {
          setAttendanceData(records);
        } else {
          setAttendanceData(mockAttendanceData);
        }
        
        // Load students
        const loadedStudents = await loadStudents();
        if (loadedStudents && loadedStudents.length > 0) {
          setStudents(loadedStudents);
        } else {
          setStudents(mockStudents);
        }
      } catch (err) {
        console.error("Error loading data from files:", err);
        // Use mock data as fallback
        setAttendanceData(mockAttendanceData);
        setStudents(mockStudents);
      }
    };
    
    loadData();

    // Check for new attendance records in location state
    const newRecords = location.state?.newAttendanceRecords;
    if (newRecords) {
      setAttendanceData(prevData => {
        // Create a unique set of records by ID
        const recordMap = new Map();
        [...prevData, ...newRecords].forEach(record => {
          recordMap.set(record.id, record);
        });
        const updatedRecords = Array.from(recordMap.values());
        
        // Save to file storage
        saveAttendanceRecords(updatedRecords);
        
        return updatedRecords;
      });
    }

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
      // Set hours to 0 to ensure full day coverage
      fromDate.setHours(0, 0, 0, 0);
      
      const toDate = new Date(dateRange.to);
      // Set hours to 23:59:59 to ensure full day coverage
      toDate.setHours(23, 59, 59, 999);
      
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= fromDate && recordDate <= toDate;
      });
    }
    
    // Apply search filter if search term is provided
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(record => 
        record.studentName.toLowerCase().includes(term)
      );
    }
    
    // Filter by student selection mode
    if (selectionMode === 'single' && selectedStudentId) {
      filtered = filtered.filter(record => record.studentId === selectedStudentId);
    } else if (selectionMode === 'multiple' && selectedStudentsIds.length > 0) {
      filtered = filtered.filter(record => selectedStudentsIds.includes(record.studentId));
    }
    // If selectionMode is 'all', we don't filter by student
    
    // For student role, always filter by their ID
    if (user?.role === 'student') {
      filtered = filtered.filter(record => record.studentId === selectedStudentId);
    }
    
    setFilteredData(filtered);
  }, [dateRange, attendanceData, selectedStudentId, selectedStudentsIds, selectionMode, user, searchTerm]);

  const handleRegisterAttendance = () => {
    // Pass the selection mode and selected students to attendance registration page
    navigate('/attendance-registration', { 
      state: { 
        user,
        selectedStudentId: selectedStudentId,
        selectedStudentsIds: selectedStudentsIds,
        selectionMode: selectionMode,
        students: students
      } 
    });
  };

  const handleAttendanceUpdate = (updatedRecords: AttendanceRecord[]) => {
    setAttendanceData(updatedRecords);
    // Save the updated records to file
    saveAttendanceRecords(updatedRecords);
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
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="w-full md:w-1/2">
                  <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
                </div>
                <div className="w-full md:w-1/2">
                  <div className="relative w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Pesquisar por aluno..."
                      className="pl-8 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {user?.role !== 'student' && (
                <div className="flex flex-wrap gap-2 items-center">
                  <StudentSelector 
                    students={students} 
                    selectedStudentId={selectedStudentId} 
                    setSelectedStudentId={setSelectedStudentId}
                    selectedStudentsIds={selectedStudentsIds}
                    setSelectedStudentsIds={setSelectedStudentsIds}
                    selectionMode={selectionMode}
                    setSelectionMode={setSelectionMode}
                  />
                </div>
              )}
              
              {user?.role !== 'student' && (
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AddStudentButton onStudentAdded={(student) => {
                      setStudents(prev => {
                        const newStudents = [...prev, student];
                        // Save the updated students to file
                        saveStudents(newStudents);
                        return newStudents;
                      });
                    }} />
                    <Button 
                      onClick={handleRegisterAttendance}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Cadastrar Frequência
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <AttendanceTable 
          attendanceData={filteredData}
          userRole={user?.role || 'student'}
          setAttendanceData={handleAttendanceUpdate}
          selectionMode={selectionMode}
        />
        
        {/* Export buttons below the data table */}
        <div className="mt-6 flex justify-end">
          <ExportButton data={filteredData} dateRange={dateRange} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
