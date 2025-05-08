
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { loadStudents, saveAttendanceRecords, loadAttendanceRecords } from '../utils/fileStorage';
import { Student, AttendanceRecord, UserRole } from '@/types';

const AttendanceRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState<UserRole>('school');
  const [userName, setUserName] = useState<string>('Escola');
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isPresent, setIsPresent] = useState(true);
  const [checkInTime, setCheckInTime] = useState('08:00');
  const [checkOutTime, setCheckOutTime] = useState('12:00');
  const [notes, setNotes] = useState('');
  
  // Students state
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  useEffect(() => {
    // Load role from location state or localStorage
    const roleFromLocation = location.state?.userRole;
    const roleFromStorage = localStorage.getItem('userRole');
    
    if (roleFromLocation) {
      setUserRole(roleFromLocation);
    } else if (roleFromStorage) {
      setUserRole(roleFromStorage as UserRole);
    } else {
      // Redirect to login if no role found
      navigate('/');
    }

    // Set user name based on role
    if (roleFromLocation === 'student' || roleFromStorage === 'student') {
      setUserName('Carlos Silva');
    } else if (roleFromLocation === 'school' || roleFromStorage === 'school') {
      setUserName('Escola Técnica Federal');
    } else if (roleFromLocation === 'company' || roleFromStorage === 'company') {
      setUserName('Empresa ABC Tecnologia');
    }

    // Load students from location state or storage
    const studentsFromLocation = location.state?.students;
    
    if (studentsFromLocation) {
      setStudents(studentsFromLocation);
    } else {
      loadStudents().then(loadedStudents => {
        if (loadedStudents.length > 0) {
          setStudents(loadedStudents);
          setSelectedStudentId(loadedStudents[0].id);
        }
      });
    }
  }, [location, navigate]);

  // Check if user can register attendance for the selected day
  const canRegisterForSelectedDate = () => {
    if (!userRole || !selectedDate) return false;
    
    const dayOfWeek = selectedDate.getDay();
    
    // 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday
    const isSchoolDay = dayOfWeek === 1 || dayOfWeek === 2; // Monday and Tuesday
    const isCompanyDay = dayOfWeek === 3 || dayOfWeek === 4 || dayOfWeek === 5; // Wednesday, Thursday, Friday
    
    return (userRole === 'school' && isSchoolDay) || 
           (userRole === 'company' && isCompanyDay);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canRegisterForSelectedDate()) {
      alert(`Você só pode cadastrar frequência nos dias designados para ${userRole === 'school' ? 'escolas' : 'empresas'}`);
      return;
    }
    
    if (!selectedStudentId) {
      alert('Por favor, selecione um aluno');
      return;
    }
    
    setLoading(true);
    
    try {
      const student = students.find(s => s.id === selectedStudentId);
      
      if (!student) {
        alert('Aluno não encontrado');
        setLoading(false);
        return;
      }
      
      // Format date to YYYY-MM-DD
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      // Load existing records
      const existingRecords = await loadAttendanceRecords();
      
      // Create new record
      const newRecord: AttendanceRecord = {
        id: `${Date.now()}`,
        studentId: student.id,
        studentName: student.name,
        date: formattedDate,
        isPresent,
        ...(isPresent && { checkInTime, checkOutTime }),
        ...(notes && { notes })
      };
      
      // Add new record to existing records
      const updatedRecords = [...existingRecords, newRecord];
      
      // Save to storage
      await saveAttendanceRecords(updatedRecords);
      
      alert('Frequência registrada com sucesso!');
      
      // Navigate back to dashboard
      navigate('/dashboard', {
        state: { newAttendanceRecord: newRecord }
      });
    } catch (error) {
      console.error('Erro ao registrar frequência:', error);
      alert('Ocorreu um erro ao registrar a frequência. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar userType={userRole} userName={userName} />

      <div className="main-content">
        <div className="content-header">
          <h1 className="header-title">Cadastro de Frequência</h1>
        </div>

        <div className="content-body">
          <div className="max-w-xl mx-auto">
            <div className="card">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Aluno</label>
                  <select 
                    className="form-control"
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    required
                  >
                    <option value="">Selecione um aluno</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Data</label>
                  <input 
                    type="date" 
                    className="form-control"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    required
                  />
                  {!canRegisterForSelectedDate() && (
                    <p className="text-red-500 mt-1 text-sm">
                      {userRole === 'school' 
                        ? 'Escolas só podem registrar frequência às segundas e terças-feiras.' 
                        : 'Empresas só podem registrar frequência às quartas, quintas e sextas-feiras.'}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="isPresent"
                      checked={isPresent} 
                      onChange={(e) => setIsPresent(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="isPresent" className="form-label mb-0">Presente</label>
                  </div>
                </div>

                {isPresent && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Hora de Entrada</label>
                      <input 
                        type="time" 
                        className="form-control"
                        value={checkInTime}
                        onChange={(e) => setCheckInTime(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Hora de Saída</label>
                      <input 
                        type="time" 
                        className="form-control"
                        value={checkOutTime}
                        onChange={(e) => setCheckOutTime(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Observações</label>
                  <textarea 
                    className="form-control"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Opcional"
                  ></textarea>
                </div>

                <div className="flex justify-between mt-6">
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading || !canRegisterForSelectedDate()}
                  >
                    {loading ? 'Salvando...' : 'Salvar Frequência'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceRegistration;
