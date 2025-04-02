
import React from 'react';
import { format, parseISO, isMonday, isTuesday, isWednesday, isThursday, isFriday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AttendanceRecord, UserRole } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AttendanceTableProps {
  attendanceData: AttendanceRecord[];
  userRole: UserRole;
  setAttendanceData: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  selectionMode?: 'single' | 'multiple' | 'all';
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ 
  attendanceData = [], 
  userRole,
  setAttendanceData,
  selectionMode = 'all'
}) => {
  const handleAttendanceChange = (recordId: string, isPresent: boolean) => {
    const record = attendanceData.find(record => record.id === recordId);
    if (!record) return;
    
    const dateObj = parseISO(record.date);
    
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
    
    setAttendanceData(prevData => {
      const updatedData = prevData.map(record => 
        record.id === recordId 
          ? { ...record, isPresent } 
          : record
      );
      
      localStorage.setItem('attendanceRecords', JSON.stringify(updatedData));
      
      return updatedData;
    });
    
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

  const groupedAttendance = React.useMemo(() => {
    if (userRole === 'student') {
      return {};
    }
    
    const grouped: Record<string, AttendanceRecord[]> = {};
    
    attendanceData.forEach(record => {
      if (!grouped[record.studentId]) {
        grouped[record.studentId] = [];
      }
      grouped[record.studentId].push(record);
    });
    
    return grouped;
  }, [attendanceData, userRole]);

  const groupedByDate = React.useMemo(() => {
    const byDate: Record<string, Record<string, AttendanceRecord>> = {};
    
    attendanceData.forEach(record => {
      const dayOfWeek = getDayOfWeek(record.date);
      
      if (!byDate[dayOfWeek]) {
        byDate[dayOfWeek] = {};
      }
      
      byDate[dayOfWeek][record.studentId] = record;
    });
    
    return byDate;
  }, [attendanceData]);

  const students = React.useMemo(() => {
    const uniqueStudents = new Map<string, string>();
    
    attendanceData.forEach(record => {
      if (!uniqueStudents.has(record.studentId)) {
        uniqueStudents.set(record.studentId, record.studentName);
      }
    });
    
    return Array.from(uniqueStudents.entries()).map(([id, name]) => ({ id, name }));
  }, [attendanceData]);

  const weekDays = React.useMemo(() => {
    const uniqueDates = new Set<string>();
    
    attendanceData.forEach(record => {
      uniqueDates.add(getDayOfWeek(record.date));
    });
    
    const dayOrder = ['segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira'];
    
    return Array.from(uniqueDates)
      .filter(day => dayOrder.includes(day))
      .sort((a, b) => {
        return dayOrder.indexOf(a) - dayOrder.indexOf(b);
      });
  }, [attendanceData]);

  const renderWeeklyTable = () => {
    if (students.length === 0 || weekDays.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground border border-border rounded-lg">
          Nenhum registro de frequência encontrado para o período selecionado
        </div>
      );
    }

    return (
      <div className="overflow-auto rounded-md border border-border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px] sticky left-0 bg-background z-10">Aluno</TableHead>
              {weekDays.map((day) => (
                <TableHead key={day} className="min-w-[150px] text-center">
                  <span className="capitalize">{day}</span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium sticky left-0 bg-background z-10">{student.name}</TableCell>
                {weekDays.map((day) => {
                  const record = groupedByDate[day]?.[student.id];
                  
                  if (!record) {
                    return (
                      <TableCell key={day} className="text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Sem registro
                        </span>
                      </TableCell>
                    );
                  }
                  
                  return (
                    <TableCell key={day} className="text-center">
                      <div className="flex flex-col gap-1 items-center">
                        <div>
                          {record.isPresent ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                              Presente
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                              Ausente
                            </span>
                          )}
                        </div>
                        <div className="mt-1">
                          {canEditRecord(record.date) && (
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
                                className="text-xs cursor-pointer"
                              >
                                Marcar presença
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  if (userRole !== 'student') {
    if (Object.keys(groupedAttendance).length > 5 || selectionMode === 'all') {
      return renderWeeklyTable();
    }
    
    return (
      <div className="space-y-6 animate-fade-in">
        {Object.keys(groupedAttendance).length > 0 ? (
          Object.entries(groupedAttendance).map(([studentId, records]) => {
            const studentName = records[0]?.studentName || "Unknown Student";
            
            return (
              <div key={studentId} className="border border-border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-secondary p-4">
                  <h3 className="text-lg font-medium">{studentName}</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-2 text-left">Data</th>
                        <th className="px-4 py-2 text-left">Presente</th>
                        <th className="px-4 py-2 text-left">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map(record => (
                        <tr key={record.id} className="border-t border-border hover:bg-muted/20">
                          <td className="px-4 py-2">
                            {formatDate(record.date)}
                            <div className="text-xs text-muted-foreground capitalize">
                              {getDayOfWeek(record.date)}
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            {record.isPresent ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                Presente
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                                Ausente
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2">
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground border border-border rounded-lg">
            Nenhum registro de frequência encontrado para o período selecionado
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto rounded-md border border-border shadow-sm animate-fade-in">
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Dia da Semana</th>
            <th>Presente</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.length > 0 ? (
            attendanceData.map((record) => (
              <tr key={record.id} className="border-t border-border">
                <td>{formatDate(record.date)}</td>
                <td className="capitalize">{getDayOfWeek(record.date)}</td>
                <td>
                  {record.isPresent ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      Presente
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                      Ausente
                    </span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center py-8 text-muted-foreground">
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
