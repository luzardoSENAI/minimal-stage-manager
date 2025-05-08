
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [userName, setUserName] = useState<string>('Aluno');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    // Load role from localStorage
    const roleFromStorage = localStorage.getItem('userRole');
    
    if (roleFromStorage) {
      setUserRole(roleFromStorage as UserRole);
    } else {
      // Redirect to login if no role found
      navigate('/');
    }

    // Set user name and mock data based on role
    if (roleFromStorage === 'student') {
      setName('Carlos Silva');
      setEmail('carlos.silva@email.com');
      setPhone('(11) 98765-4321');
      setCompany('ABC Tecnologia');
      setPosition('Estagiário de Desenvolvimento');
      setStartDate('2025-01-15');
      setEndDate('2025-07-15');
      setBio('Estudante de Análise e Desenvolvimento de Sistemas, atualmente estagiando na área de desenvolvimento web.');
    } else if (roleFromStorage === 'school') {
      setName('Escola Técnica Federal');
      setEmail('contato@etf.edu.br');
      setPhone('(11) 3456-7890');
      setCompany('');
      setPosition('Instituição de Ensino');
      setStartDate('');
      setEndDate('');
      setBio('Instituição educacional focada na formação técnica e profissional de jovens.');
    } else if (roleFromStorage === 'company') {
      setName('Empresa ABC Tecnologia');
      setEmail('rh@abctech.com');
      setPhone('(11) 2345-6789');
      setCompany('ABC Tecnologia');
      setPosition('Empresa Parceira');
      setStartDate('');
      setEndDate('');
      setBio('Empresa de tecnologia especializada em soluções de software para pequenas e médias empresas.');
    }

    setUserName(name);
  }, [navigate]);

  useEffect(() => {
    // Update userName when name changes
    if (name) {
      setUserName(name);
    }
  }, [name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Perfil atualizado com sucesso!');
  };

  return (
    <div className="app-container">
      <Sidebar userType={userRole} userName={userName} />

      <div className="main-content">
        <div className="content-header">
          <h1 className="header-title">Meu Perfil</h1>
        </div>

        <div className="content-body">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="card text-center">
                <div className="w-32 h-32 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-5xl font-semibold mx-auto mb-4">
                  {name.charAt(0)}
                </div>
                <h2 className="text-2xl font-semibold mb-2">{name}</h2>
                <p className="text-muted-foreground mb-4">{position}</p>
                
                {userRole === 'student' && (
                  <div className="bg-secondary rounded-lg p-4 mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Progresso do Estágio</span>
                      <span className="text-sm font-semibold">60%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2 text-left mb-4">
                  <p className="flex items-center">
                    <span className="w-5 h-5 mr-2">📧</span>
                    <span className="text-sm">{email}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="w-5 h-5 mr-2">📱</span>
                    <span className="text-sm">{phone}</span>
                  </p>
                  {company && (
                    <p className="flex items-center">
                      <span className="w-5 h-5 mr-2">🏢</span>
                      <span className="text-sm">{company}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="text-2xl font-semibold mb-4">Editar Informações</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="form-group">
                      <label className="form-label">Nome Completo</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                      <label className="form-label">Telefone</label>
                      <input 
                        type="tel" 
                        className="form-control"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    {userRole === 'student' && (
                      <>
                        <div className="form-group">
                          <label className="form-label">Empresa</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Cargo</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
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
                      </>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Sobre</label>
                    <textarea 
                      className="form-control" 
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" type="button">Cancelar</Button>
                    <Button type="submit">Salvar Alterações</Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
