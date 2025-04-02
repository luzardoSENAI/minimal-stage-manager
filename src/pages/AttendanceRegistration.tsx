
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Header from '@/components/Header';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { AttendanceRecord, User } from '@/types';
import { loadStudents, saveAttendanceRecords } from '@/utils/fileStorage';

const AttendanceRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Estado para o formulário
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isPresent, setIsPresent] = useState(true);
  const [checkInTime, setCheckInTime] = useState('08:00');
  const [checkOutTime, setCheckOutTime] = useState('12:00');
  const [notes, setNotes] = useState('');
  
  // Estado para os estudantes
  const [students, setStudents] = useState<Array<{ id: string; name: string; }>>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedStudentsIds, setSelectedStudentsIds] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState<'single' | 'multiple' | 'all'>('all');
  
  useEffect(() => {
    const locationState = location.state;
    
    if (!locationState?.user) {
      toast.error('Você precisa estar logado para cadastrar frequência');
      navigate('/');
      return;
    }
    
    setUser(locationState.user);
    
    if (locationState.selectedStudentId) {
      setSelectedStudentId(locationState.selectedStudentId);
    }
    
    if (locationState.selectedStudentsIds) {
      setSelectedStudentsIds(locationState.selectedStudentsIds);
    }
    
    if (locationState.selectionMode) {
      setSelectionMode(locationState.selectionMode);
    }
    
    // Load students from passed data or from storage
    if (locationState.students && locationState.students.length > 0) {
      setStudents(locationState.students);
    } else {
      // Load students from storage
      loadStudents().then((loadedStudents) => {
        if (loadedStudents && loadedStudents.length > 0) {
          setStudents(loadedStudents);
        }
      });
    }
  }, [navigate, location]);
  
  // Verificar se o usuário pode cadastrar frequência neste dia da semana
  const canRegisterForSelectedDate = () => {
    if (!user || !selectedDate) return false;
    
    const dayOfWeek = selectedDate.getDay();
    
    // 0 = Domingo, 1 = Segunda, 2 = Terça, 3 = Quarta, 4 = Quinta, 5 = Sexta, 6 = Sábado
    const isSchoolDay = dayOfWeek === 1 || dayOfWeek === 2; // Segunda e Terça
    const isCompanyDay = dayOfWeek === 3 || dayOfWeek === 4 || dayOfWeek === 5; // Quarta, Quinta e Sexta
    
    return (user.role === 'school' && isSchoolDay) || 
           (user.role === 'company' && isCompanyDay);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canRegisterForSelectedDate()) {
      const dayMessage = user?.role === 'school' 
        ? 'segundas e terças-feiras' 
        : 'quartas, quintas e sextas-feiras';
      toast.error(`Você só pode cadastrar frequência para ${dayMessage}`);
      return;
    }
    
    setLoading(true);
    
    try {
      let selectedStudents: { id: string; name: string }[] = [];
      
      if (selectionMode === 'single' && selectedStudentId) {
        const student = students.find(s => s.id === selectedStudentId);
        if (student) {
          selectedStudents = [student];
        }
      } else if (selectionMode === 'multiple' && selectedStudentsIds.length > 0) {
        selectedStudents = students.filter(s => selectedStudentsIds.includes(s.id));
      } else {
        selectedStudents = students;
      }
      
      if (selectedStudents.length === 0) {
        toast.error('Selecione pelo menos um aluno');
        setLoading(false);
        return;
      }
      
      // Format date to YYYY-MM-DD
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      // Get existing attendance records from storage
      const existingRecords = await loadAttendanceRecords();
      
      // Create new attendance records
      const newAttendanceRecords = selectedStudents.map(student => ({
        id: `${Date.now()}-${student.id}`,
        studentId: student.id,
        studentName: student.name,
        date: formattedDate,
        isPresent,
        ...(isPresent && { checkInTime, checkOutTime }),
        ...(notes && { notes })
      }));
      
      // Merge with existing records, overwriting duplicates
      const recordsMap = new Map();
      [...existingRecords, ...newAttendanceRecords].forEach(record => {
        const key = `${record.studentId}-${record.date}`;
        recordsMap.set(key, record);
      });
      
      const updatedRecords = Array.from(recordsMap.values());
      
      // Save to storage
      await saveAttendanceRecords(updatedRecords);
      
      toast.success('Frequência cadastrada com sucesso!');
      
      // Redirecionar para o dashboard com os novos registros
      navigate('/dashboard', {
        state: {
          user,
          newAttendanceRecords: newAttendanceRecords
        }
      });
    } catch (error) {
      console.error('Erro ao registrar frequência:', error);
      toast.error('Erro ao registrar frequência. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header user={user} />
      
      <main className="container py-8">
        <div className="mb-8 space-y-2">
          <h1 className="text-2xl font-bold">Cadastro de Frequência</h1>
          <p className="text-muted-foreground">
            {user?.role === 'school' ? 
              'Registre a frequência dos alunos na escola (disponível segundas e terças)' : 
              'Registre a frequência dos estagiários na empresa (disponível quartas, quintas e sextas)'}
          </p>
        </div>
        
        <Card className="max-w-md mx-auto">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-6">
              {/* Date Selection */}
              <div className="space-y-2">
                <Label>Selecione a Data:</Label>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                    locale={ptBR}
                  />
                </div>
                {!canRegisterForSelectedDate() && (
                  <p className="text-sm text-red-500">
                    {user?.role === 'school' ? 
                      'Você só pode registrar frequência às segundas e terças-feiras.' :
                      'Você só pode registrar frequência às quartas, quintas e sextas-feiras.'}
                  </p>
                )}
              </div>
              
              {/* Attendance Status */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isPresent" 
                    checked={isPresent} 
                    onCheckedChange={(checked) => checked !== "indeterminate" && setIsPresent(checked)}
                  />
                  <Label htmlFor="isPresent">Aluno presente</Label>
                </div>
              </div>
              
              {/* Check-in and Check-out Time */}
              {isPresent && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkInTime">Horário de Entrada:</Label>
                    <Input
                      id="checkInTime"
                      type="time"
                      value={checkInTime}
                      onChange={(e) => setCheckInTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkOutTime">Horário de Saída:</Label>
                    <Input
                      id="checkOutTime"
                      type="time"
                      value={checkOutTime}
                      onChange={(e) => setCheckOutTime(e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Observações:</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Opcional"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(-1)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={loading || !canRegisterForSelectedDate()}
              >
                {loading ? 'Salvando...' : 'Salvar Frequência'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default AttendanceRegistration;
