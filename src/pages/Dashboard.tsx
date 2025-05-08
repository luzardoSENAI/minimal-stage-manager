
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { loadStudents, loadAttendanceRecords, saveAttendanceRecords } from '../utils/fileStorage';
import { Student, AttendanceRecord, UserRole, DateRange } from '@/types';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [userName, setUserName] = useState<string>('Aluno');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
    to: new Date()
  });
  const [viewMode, setViewMode] = useState<'attendance' | 'evaluations'>('attendance');
  const [showCollapsible, setShowCollapsible] = useState<{[key: string]: boolean}>({
    'dept1': true,
    'dept2': false
  });

  useEffect(() => {
    // Load role from location state or localStorage
    const roleFromLocation = location.state?.role;
    const roleFromStorage = localStorage.getItem('userRole');
    
    if (roleFromLocation) {
      setUserRole(roleFromLocation as UserRole);
      localStorage.setItem('userRole', roleFromLocation);
    } else if (roleFromStorage) {
      setUserRole(roleFromStorage as UserRole);
    } else {
      // Redirect to login if no role found
      navigate('/');
    }

    // Set user name
    if (roleFromLocation === 'student' || roleFromStorage === 'student') {
      setUserName('Carlos Silva');
    } else if (roleFromLocation === 'school' || roleFromStorage === 'school') {
      setUserName('Escola Técnica Federal');
    } else if (roleFromLocation === 'company' || roleFromStorage === 'company') {
      setUserName('Empresa ABC Tecnologia');
    }
    
    // Load students and attendance data
    loadStudents().then(data => {
      if (data.length > 0) {
        setStudents(data);
      } else {
        // Mock data
        const mockStudentsData = [
          { id: '101', name: 'Ana Silva', company: 'Tech Solutions', contact: 'ana.silva@email.com' },
          { id: '102', name: 'Carlos Mendes', company: 'InnovaSoft', contact: 'carlos.mendes@email.com' },
        ];
        setStudents(mockStudentsData);
      }
    });
    
    loadAttendanceRecords().then(data => {
      if (data.length > 0) {
        setAttendanceRecords(data);
      } else {
        // Mock data
        const mockAttendanceData = [
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
        ];
        setAttendanceRecords(mockAttendanceData);
      }
    });
  }, [location, navigate]);

  // Filter records based on search, date range, and selected student
  useEffect(() => {
    let filtered = attendanceRecords;
    
    // Filter by date range
    if (dateRange.from && dateRange.to) {
      const fromTime = dateRange.from.getTime();
      const toTime = dateRange.to.getTime();
      
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.date).getTime();
        return recordDate >= fromTime && recordDate <= toTime;
      });
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(record => 
        record.studentName.toLowerCase().includes(term)
      );
    }
    
    // Filter by selected student
    if (selectedStudentId) {
      filtered = filtered.filter(record => record.studentId === selectedStudentId);
    }
    
    // For student role, only show their own records
    if (userRole === 'student') {
      // In a real app, this would use the actual logged-in student ID
      filtered = filtered.filter(record => record.studentId === '101');
    }
    
    setFilteredRecords(filtered);
  }, [attendanceRecords, dateRange, searchTerm, selectedStudentId, userRole]);

  // Toggle collapsible sections
  const toggleCollapsible = (id: string) => {
    setShowCollapsible(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Function to handle new attendance registration
  const handleNewAttendance = () => {
    navigate('/attendance-registration', { 
      state: { 
        userRole,
        students
      }
    });
  };

  return (
    <div className="app-container">
      <Sidebar userType={userRole} userName={userName} />

      <div className="main-content">
        <div className="content-header">
          <h1 className="header-title">
            {viewMode === 'attendance' ? 'Controle de Frequência' : 'Avaliações'}
          </h1>
        </div>

        <div className="content-body">
          {/* Tabs for switching between views */}
          <div className="flex mb-6">
            <button 
              className={`px-6 py-3 text-lg font-medium ${viewMode === 'attendance' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-500'}`}
              onClick={() => setViewMode('attendance')}
            >
              Frequência
            </button>
            <button 
              className={`px-6 py-3 text-lg font-medium ${viewMode === 'evaluations' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-500'}`}
              onClick={() => setViewMode('evaluations')}
            >
              Avaliações
            </button>
          </div>

          {viewMode === 'attendance' ? (
            /* Attendance View */
            <>
              {/* Filters and Actions */}
              <div className="card">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="form-label">Data Inicial</label>
                    <input 
                      type="date" 
                      className="form-control"
                      value={dateRange.from ? dateRange.from.toISOString().split('T')[0] : ''}
                      onChange={(e) => setDateRange(prev => ({...prev, from: new Date(e.target.value)}))}
                    />
                  </div>
                  <div>
                    <label className="form-label">Data Final</label>
                    <input 
                      type="date" 
                      className="form-control"
                      value={dateRange.to ? dateRange.to.toISOString().split('T')[0] : ''}
                      onChange={(e) => setDateRange(prev => ({...prev, to: new Date(e.target.value)}))}
                    />
                  </div>
                  <div>
                    <label className="form-label">Pesquisar</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="Nome do aluno..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {userRole !== 'student' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="form-label">Aluno</label>
                      <select 
                        className="form-control"
                        value={selectedStudentId || ''}
                        onChange={(e) => setSelectedStudentId(e.target.value || null)}
                      >
                        <option value="">Todos</option>
                        {students.map(student => (
                          <option key={student.id} value={student.id}>
                            {student.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2 flex items-end">
                      <button 
                        className="btn btn-primary"
                        onClick={handleNewAttendance}
                      >
                        + Cadastrar Frequência
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Attendance Table */}
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Aluno</th>
                      <th>Data</th>
                      <th>Dia da Semana</th>
                      <th>Presença</th>
                      <th>Entrada</th>
                      <th>Saída</th>
                      <th>Observações</th>
                      {userRole !== 'student' && <th>Ações</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.length > 0 ? (
                      filteredRecords.map(record => {
                        const recordDate = new Date(record.date);
                        const dayOfWeek = recordDate.toLocaleDateString('pt-BR', { weekday: 'long' });
                        
                        return (
                          <tr key={record.id}>
                            <td>{record.studentName}</td>
                            <td>{recordDate.toLocaleDateString('pt-BR')}</td>
                            <td className="capitalize">{dayOfWeek}</td>
                            <td>
                              {record.isPresent ? (
                                <span>
                                  <span className="status-indicator status-present"></span>
                                  Presente
                                </span>
                              ) : (
                                <span>
                                  <span className="status-indicator status-absent"></span>
                                  Ausente
                                </span>
                              )}
                            </td>
                            <td>{record.checkInTime || '-'}</td>
                            <td>{record.checkOutTime || '-'}</td>
                            <td>{record.notes || '-'}</td>
                            {userRole !== 'student' && (
                              <td>
                                <button className="text-blue-700 hover:underline mr-2">Editar</button>
                                <button className="text-red-600 hover:underline">Excluir</button>
                              </td>
                            )}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={userRole !== 'student' ? 8 : 7} className="text-center py-4">
                          Nenhum registro encontrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Export Buttons */}
              <div className="flex justify-end mt-4">
                <button className="btn btn-outline mr-2">Exportar Excel</button>
                <button className="btn btn-outline">Exportar PDF</button>
              </div>
            </>
          ) : (
            /* Evaluations View */
            <>
              {/* Department 1 */}
              <button 
                className={`collapsible ${showCollapsible['dept1'] ? 'active' : ''}`} 
                onClick={() => toggleCollapsible('dept1')}
              >
                Departamento 1
              </button>
              <div className="collapsible-content" style={{maxHeight: showCollapsible['dept1'] ? '1000px' : '0'}}>
                {/* Student 1 */}
                <div className="student-card">
                  <div className="student-avatar">
                    <img src="/public/lovable-uploads/8cf02ac2-1c0d-4708-b971-18ceaa539b9b.png" alt="Estagiário" width="50" />
                  </div>
                  <div className="student-info">
                    <div className="student-name">Estagiário 01</div>
                    <div className="rating">
                      <div className="flex mb-2">
                        <div className="w-40">Frequência mensal</div>
                        <div className="rating">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} className="star">★</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex mb-2">
                        <div className="w-40">Convivência social</div>
                        <div className="rating">
                          {[1, 2, 3, 4].map(star => (
                            <span key={star} className="star">★</span>
                          ))}
                          <span className="star" style={{color: '#ccc'}}>★</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="student-rating">4.3</div>
                </div>

                {/* Student 2 */}
                <div className="student-card">
                  <div className="student-avatar">
                    <img src="/public/lovable-uploads/8cf02ac2-1c0d-4708-b971-18ceaa539b9b.png" alt="Estagiário" width="50" />
                  </div>
                  <div className="student-info">
                    <div className="student-name">Estagiário 02</div>
                    <div className="rating">
                      <div className="flex mb-2">
                        <div className="w-40">Frequência mensal</div>
                        <div className="rating">
                          {[1, 2, 3].map(star => (
                            <span key={star} className="star">★</span>
                          ))}
                          {[4, 5].map(star => (
                            <span key={star} className="star" style={{color: '#ccc'}}>★</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex mb-2">
                        <div className="w-40">Convivência social</div>
                        <div className="rating">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} className="star">★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="student-rating">3.5</div>
                </div>
              </div>

              {/* Department 2 */}
              <button 
                className={`collapsible ${showCollapsible['dept2'] ? 'active' : ''}`} 
                onClick={() => toggleCollapsible('dept2')}
              >
                Departamento 2
              </button>
              <div className="collapsible-content" style={{maxHeight: showCollapsible['dept2'] ? '1000px' : '0'}}>
                <div className="student-card">
                  <div className="student-avatar">
                    <img src="/public/lovable-uploads/8cf02ac2-1c0d-4708-b971-18ceaa539b9b.png" alt="Estagiário" width="50" />
                  </div>
                  <div className="student-info">
                    <div className="student-name">Estagiário 03</div>
                    <div className="rating">
                      <div className="flex mb-2">
                        <div className="w-40">Frequência mensal</div>
                        <div className="rating">
                          {[1, 2, 3, 4].map(star => (
                            <span key={star} className="star">★</span>
                          ))}
                          <span className="star" style={{color: '#ccc'}}>★</span>
                        </div>
                      </div>
                      <div className="flex mb-2">
                        <div className="w-40">Convivência social</div>
                        <div className="rating">
                          {[1, 2, 3, 4].map(star => (
                            <span key={star} className="star">★</span>
                          ))}
                          <span className="star" style={{color: '#ccc'}}>★</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="student-rating">4.0</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
