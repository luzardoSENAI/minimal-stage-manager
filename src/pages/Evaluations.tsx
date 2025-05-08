
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { UserRole, Evaluation } from '@/types';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const EvaluationsPage = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [userName, setUserName] = useState<string>('Aluno');
  const [students, setStudents] = useState<{id: string, name: string}[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  
  // Form fields
  const [attendance, setAttendance] = useState<number>(7);
  const [socialInteraction, setSocialInteraction] = useState<number>(7);
  const [practicalLearning, setPracticalLearning] = useState<number>(7);
  const [workQuality, setWorkQuality] = useState<number>(7);
  const [comments, setComments] = useState<string>('');

  useEffect(() => {
    // Load role from localStorage
    const roleFromStorage = localStorage.getItem('userRole');
    
    if (roleFromStorage) {
      setUserRole(roleFromStorage as UserRole);
    } else {
      // Redirect to login if no role found
      navigate('/');
    }

    // Set user name based on role
    if (roleFromStorage === 'student') {
      setUserName('Carlos Silva');
    } else if (roleFromStorage === 'school') {
      setUserName('Escola Técnica Federal');
    } else if (roleFromStorage === 'company') {
      setUserName('Empresa ABC Tecnologia');
    }

    // Load mock students
    const mockStudents = [
      { id: '1', name: 'Ana Silva' },
      { id: '2', name: 'Bruno Oliveira' },
      { id: '3', name: 'Carla Santos' },
      { id: '4', name: 'Daniel Freitas' },
    ];
    setStudents(mockStudents);

    // Load mock evaluations
    const mockEvaluations = [
      {
        id: '1',
        studentId: '1',
        studentName: 'Ana Silva',
        evaluatorId: '100',
        evaluatorName: 'João Supervisor',
        date: '2025-05-01',
        attendance: 9,
        socialInteraction: 8,
        practicalLearning: 7,
        workQuality: 9,
        comments: 'Excelente desempenho no último mês.'
      },
      {
        id: '2',
        studentId: '2',
        studentName: 'Bruno Oliveira',
        evaluatorId: '100',
        evaluatorName: 'João Supervisor',
        date: '2025-05-02',
        attendance: 6,
        socialInteraction: 7,
        practicalLearning: 8,
        workQuality: 6,
        comments: 'Precisa melhorar a pontualidade.'
      }
    ];
    setEvaluations(mockEvaluations);
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent) {
      toast.error('Por favor, selecione um aluno');
      return;
    }
    
    const student = students.find(s => s.id === selectedStudent);
    
    if (!student) {
      toast.error('Aluno não encontrado');
      return;
    }
    
    const newEvaluation: Evaluation = {
      id: Date.now().toString(),
      studentId: selectedStudent,
      studentName: student.name,
      evaluatorId: '100',
      evaluatorName: 'João Supervisor',
      date: new Date().toISOString().split('T')[0],
      attendance,
      socialInteraction,
      practicalLearning,
      workQuality,
      comments
    };
    
    setEvaluations([...evaluations, newEvaluation]);
    toast.success('Avaliação registrada com sucesso!');
    
    // Reset form
    setSelectedStudent('');
    setAttendance(7);
    setSocialInteraction(7);
    setPracticalLearning(7);
    setWorkQuality(7);
    setComments('');
  };

  const calculateAverage = (evaluation: Evaluation) => {
    return (evaluation.attendance + evaluation.socialInteraction + 
            evaluation.practicalLearning + evaluation.workQuality) / 4;
  };

  return (
    <div className="app-container">
      <Sidebar userType={userRole} userName={userName} />

      <div className="main-content">
        <div className="content-header">
          <h1 className="header-title">Avaliações</h1>
        </div>

        <div className="content-body">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form for new evaluations */}
            <div className="card">
              <h2 className="text-2xl font-semibold mb-4">Nova Avaliação</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Aluno</label>
                  <select 
                    className="form-control" 
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
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
                  <label className="form-label">Frequência (1-10)</label>
                  <Slider 
                    defaultValue={[attendance]}
                    max={10}
                    step={1}
                    min={1}
                    onValueChange={(value) => setAttendance(value[0])}
                  />
                  <div className="text-right">{attendance}/10</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Interação Social (1-10)</label>
                  <Slider 
                    defaultValue={[socialInteraction]}
                    max={10}
                    step={1}
                    min={1}
                    onValueChange={(value) => setSocialInteraction(value[0])}
                  />
                  <div className="text-right">{socialInteraction}/10</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Aprendizado Prático (1-10)</label>
                  <Slider 
                    defaultValue={[practicalLearning]}
                    max={10}
                    step={1}
                    min={1}
                    onValueChange={(value) => setPracticalLearning(value[0])}
                  />
                  <div className="text-right">{practicalLearning}/10</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Qualidade do Trabalho (1-10)</label>
                  <Slider 
                    defaultValue={[workQuality]}
                    max={10}
                    step={1}
                    min={1}
                    onValueChange={(value) => setWorkQuality(value[0])}
                  />
                  <div className="text-right">{workQuality}/10</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Comentários</label>
                  <textarea 
                    className="form-control" 
                    rows={4}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  ></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary mt-4 w-full">
                  Registrar Avaliação
                </button>
              </form>
            </div>
            
            {/* List of evaluations */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Avaliações Recentes</h2>
              
              {evaluations.length > 0 ? (
                <div className="space-y-4">
                  {evaluations.map(evaluation => (
                    <div key={evaluation.id} className="student-card">
                      <div className="student-avatar">
                        {evaluation.studentName.charAt(0)}
                      </div>
                      <div className="student-info">
                        <div className="student-name">{evaluation.studentName}</div>
                        <div className="student-meta">
                          Avaliado por: {evaluation.evaluatorName} em {evaluation.date}
                        </div>
                      </div>
                      <div className="student-rating">
                        {calculateAverage(evaluation).toFixed(1)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-secondary rounded-lg">
                  <p className="text-muted-foreground">
                    Nenhuma avaliação registrada.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationsPage;
