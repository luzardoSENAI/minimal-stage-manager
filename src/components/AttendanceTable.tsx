
import React, { useState } from 'react';
import { format, parseISO, isMonday, isTuesday, isWednesday, isThursday, isFriday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AttendanceRecord, UserRole } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface AttendanceTableProps {
  attendanceData: AttendanceRecord[];
  userRole: UserRole;
  setAttendanceData: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ 
  attendanceData, 
  userRole,
  setAttendanceData 
}) => {
  const handleAttendanceChange = (recordId: string, isPresent: boolean) => {
    const dateObj = parseISO(attendanceData.find(record => record.id === recordId)?.date || '');
    
    // Check permissions based on user role and day of week
    const isSchool = userRole === 'school';
    const isCompany = userRole === 'company';
    
    const isSchoolDay = isMonday(dateObj) || isTuesday(dateObj);
    const isCompanyDay = isWednesday(dateObj) || isThursday(dateObj) || isFriday(dateObj);
    
    if (isSchool && !isSchoolDay) {
      toast.error('Escolas só podem alterar a frequência de segunda e terça-feira');
      return;
    }
    
    if (isCompany && !isCompanyDay) {
      toast.error('Empresas só podem alterar a frequência de quarta a sexta-feira');
      return;
    }
    
    setAttendanceData(prevData => 
      prevData.map(record => 
        record.id === recordId 
          ? { ...record, isPresent } 
          : record
      )
    );
    
    toast.success('Frequência atualizada com sucesso');
  };

  const getDayOfWeek = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'EEEE', { locale: ptBR });
  };
  
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  const canEditRecord = (date: string): boolean => {
    if (userRole === 'student') return false;
    
    const dateObj = parseISO(date);
    const isSchoolDay = isMonday(dateObj) || isTuesday(dateObj);
    const isCompanyDay = isWednesday(dateObj) || isThursday(dateObj) || isFriday(dateObj);
    
    return (userRole === 'school' && isSchoolDay) || 
           (userRole === 'company' && isCompanyDay);
  };

  return (
    <div className="w-full overflow-auto rounded-md border border-border shadow-sm animate-fade-in">
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Aluno</th>
            <th>Data</th>
            <th>Dia da Semana</th>
            <th>Presente</th>
            {userRole !== 'student' && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {attendanceData.length > 0 ? (
            attendanceData.map((record) => (
              <tr key={record.id} className="border-t border-border">
                <td>{record.studentName}</td>
                <td>{formatDate(record.date)}</td>
                <td className="capitalize">{getDayOfWeek(record.date)}</td>
                <td>
                  {record.isPresent ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Presente
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Ausente
                    </span>
                  )}
                </td>
                {userRole !== 'student' && (
                  <td>
                    {canEditRecord(record.date) ? (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`attendance-${record.id}`}
                          checked={record.isPresent}
                          onCheckedChange={(checked) => 
                            handleAttendanceChange(record.id, checked === true)
                          }
                        />
                        <label 
                          htmlFor={`attendance-${record.id}`}
                          className="text-sm cursor-pointer"
                        >
                          Marcar presença
                        </label>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Não disponível
                      </span>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={userRole !== 'student' ? 5 : 4} className="text-center py-8 text-muted-foreground">
                Nenhum registro de frequência encontrado para o período selecionado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
