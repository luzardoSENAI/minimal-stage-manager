
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { UserRole } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getAttendanceRecords } from '@/utils/fileStorage';

const Reports = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [userName, setUserName] = useState<string>('Aluno');
  const [attendanceData, setAttendanceData] = useState<any[]>([]);

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

    // Load attendance data
    loadAttendanceData();
  }, [navigate]);

  const loadAttendanceData = async () => {
    const records = await getAttendanceRecords();
    
    // Process data for charts
    const studentAttendance: Record<string, {present: number, absent: number}> = {};
    
    records.forEach(record => {
      if (!studentAttendance[record.studentName]) {
        studentAttendance[record.studentName] = {
          present: 0,
          absent: 0
        };
      }
      
      if (record.isPresent) {
        studentAttendance[record.studentName].present += 1;
      } else {
        studentAttendance[record.studentName].absent += 1;
      }
    });
    
    const chartData = Object.keys(studentAttendance).map(name => ({
      name,
      Presentes: studentAttendance[name].present,
      Ausentes: studentAttendance[name].absent,
    }));
    
    setAttendanceData(chartData);
  };

  return (
    <div className="app-container">
      <Sidebar userType={userRole} userName={userName} />

      <div className="main-content">
        <div className="content-header">
          <h1 className="header-title">Relatórios</h1>
        </div>

        <div className="content-body">
          <div className="card mb-6">
            <h2 className="text-2xl font-semibold mb-4">Frequência por Aluno</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={attendanceData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Presentes" fill="#4CAF50" />
                  <Bar dataKey="Ausentes" fill="#F44336" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-xl font-semibold mb-3">Estatísticas Gerais</h3>
              <table className="data-table">
                <tbody>
                  <tr>
                    <td className="font-semibold">Total de Alunos:</td>
                    <td>{Object.keys(attendanceData).length}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Total de Registros:</td>
                    <td>{attendanceData.reduce((sum, student) => sum + student.Presentes + student.Ausentes, 0)}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Taxa de Presença:</td>
                    <td>
                      {attendanceData.length > 0 ? 
                        `${Math.round((attendanceData.reduce((sum, student) => sum + student.Presentes, 0) / 
                          attendanceData.reduce((sum, student) => sum + student.Presentes + student.Ausentes, 0)) * 100)}%` : 
                        '0%'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold mb-3">Ações Rápidas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button className="btn btn-primary">Exportar Relatório Mensal</button>
                <button className="btn btn-primary">Exportar Relatório Anual</button>
                <button className="btn btn-outline">Configurar Alertas</button>
                <button className="btn btn-outline">Ver Tendências</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
