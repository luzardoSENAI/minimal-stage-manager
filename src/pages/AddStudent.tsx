
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { addStudent } from '@/utils/fileStorage';
import { Student } from '@/types';

const AddStudent = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !company || !contact) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    try {
      const newStudent: Student = {
        id: Date.now().toString(),
        name,
        company,
        contact
      };
      
      await addStudent(newStudent);
      toast.success('Aluno adicionado com sucesso!');
      navigate('/students');
    } catch (error) {
      console.error("Failed to add student:", error);
      toast.error("Erro ao adicionar aluno");
    }
  };

  return (
    <div className="app-container">
      <Sidebar userType="school" userName="Escola Técnica Federal" />

      <div className="main-content">
        <div className="content-header">
          <h1 className="header-title">Adicionar Novo Aluno</h1>
        </div>

        <div className="content-body">
          <div className="card max-w-3xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="form-label">Nome Completo *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Empresa *</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Telefone de Contato *</label>
                  <input 
                    type="tel" 
                    className="form-control"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">E-mail</label>
                  <input 
                    type="email" 
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Curso</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Início do Estágio</label>
                  <input 
                    type="date" 
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Fim do Estágio</label>
                  <input 
                    type="date" 
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => navigate('/students')}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  Adicionar Aluno
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
