
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { UserRole, Student } from '@/types';
import { getStudents } from '@/utils/fileStorage';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const Students = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [userName, setUserName] = useState<string>('Aluno');
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

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

    // Load students from storage
    loadStudents();
  }, [navigate]);

  const loadStudents = async () => {
    try {
      const loadedStudents = await getStudents();
      setStudents(loadedStudents);
    } catch (error) {
      console.error("Failed to load students:", error);
      toast.error("Erro ao carregar alunos");
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <Sidebar userType={userRole} userName={userName} />

      <div className="main-content">
        <div className="content-header">
          <h1 className="header-title">Alunos</h1>
        </div>

        <div className="content-body">
          <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                className="form-control pl-10"
                placeholder="Pesquisar alunos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
            <Button onClick={() => navigate('/add-student')} className="btn-primary">
              Adicionar Novo Aluno
            </Button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Empresa</th>
                  <th>Contato</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td className="font-medium">{student.name}</td>
                      <td>{student.company}</td>
                      <td>{student.contact}</td>
                      <td>
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-800">Editar</button>
                          <button className="text-red-600 hover:text-red-800">Excluir</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-8">
                      {searchTerm ? 'Nenhum aluno encontrado' : 'Nenhum aluno cadastrado'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
