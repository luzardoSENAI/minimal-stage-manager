
import { Student, AttendanceRecord } from '@/types';

// Student storage
export const getStudents = async (): Promise<Student[]> => {
  try {
    const studentsStr = localStorage.getItem('students');
    return studentsStr ? JSON.parse(studentsStr) : [];
  } catch (error) {
    console.error("Error getting students:", error);
    return [];
  }
};

export const addStudent = async (student: Student): Promise<void> => {
  try {
    const students = await getStudents();
    students.push(student);
    localStorage.setItem('students', JSON.stringify(students));
  } catch (error) {
    console.error("Error adding student:", error);
    throw error;
  }
};

// Attendance records storage
export const getAttendanceRecords = async (): Promise<AttendanceRecord[]> => {
  try {
    const recordsStr = localStorage.getItem('attendanceRecords');
    return recordsStr ? JSON.parse(recordsStr) : [];
  } catch (error) {
    console.error("Error getting attendance records:", error);
    return [];
  }
};

export const addAttendanceRecord = async (record: AttendanceRecord): Promise<void> => {
  try {
    const records = await getAttendanceRecords();
    records.push(record);
    localStorage.setItem('attendanceRecords', JSON.stringify(records));
  } catch (error) {
    console.error("Error adding attendance record:", error);
    throw error;
  }
};

export const updateAttendanceRecord = async (updatedRecord: AttendanceRecord): Promise<void> => {
  try {
    const records = await getAttendanceRecords();
    const index = records.findIndex(record => record.id === updatedRecord.id);
    
    if (index !== -1) {
      records[index] = updatedRecord;
      localStorage.setItem('attendanceRecords', JSON.stringify(records));
    } else {
      throw new Error("Record not found");
    }
  } catch (error) {
    console.error("Error updating attendance record:", error);
    throw error;
  }
};

export const deleteAttendanceRecord = async (recordId: string): Promise<void> => {
  try {
    const records = await getAttendanceRecords();
    const updatedRecords = records.filter(record => record.id !== recordId);
    localStorage.setItem('attendanceRecords', JSON.stringify(updatedRecords));
  } catch (error) {
    console.error("Error deleting attendance record:", error);
    throw error;
  }
};

// Export to file-like operations
export const exportToTextFile = async (data: any, filename: string): Promise<void> => {
  try {
    const text = JSON.stringify(data, null, 2);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting to text file:", error);
    throw error;
  }
};

// Import from file-like operations
export const importFromTextFile = async (file: File): Promise<any> => {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const result = event.target?.result;
          if (typeof result === 'string') {
            const data = JSON.parse(result);
            resolve(data);
          } else {
            reject(new Error("Invalid file content"));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsText(file);
    });
  } catch (error) {
    console.error("Error importing from text file:", error);
    throw error;
  }
};

// Mock data initialization
export const initializeMockData = (): void => {
  if (!localStorage.getItem('students')) {
    const mockStudents: Student[] = [
      { id: '1', name: 'Ana Silva', company: 'ABC Tech', contact: '(11) 98765-4321' },
      { id: '2', name: 'Bruno Oliveira', company: 'XYZ Software', contact: '(11) 91234-5678' },
      { id: '3', name: 'Carla Santos', company: 'Tech Solutions', contact: '(11) 99876-5432' }
    ];
    localStorage.setItem('students', JSON.stringify(mockStudents));
  }
  
  if (!localStorage.getItem('attendanceRecords')) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const mockRecords: AttendanceRecord[] = [
      {
        id: '1',
        studentId: '1',
        studentName: 'Ana Silva',
        date: today.toISOString().split('T')[0],
        isPresent: true,
        checkInTime: '08:00',
        checkOutTime: '17:00',
        notes: 'Chegou no horário'
      },
      {
        id: '2',
        studentId: '2',
        studentName: 'Bruno Oliveira',
        date: today.toISOString().split('T')[0],
        isPresent: true,
        checkInTime: '08:15',
        checkOutTime: '17:30',
        notes: 'Chegou um pouco atrasado'
      },
      {
        id: '3',
        studentId: '3',
        studentName: 'Carla Santos',
        date: today.toISOString().split('T')[0],
        isPresent: false,
        notes: 'Ausente por doença'
      },
      {
        id: '4',
        studentId: '1',
        studentName: 'Ana Silva',
        date: yesterday.toISOString().split('T')[0],
        isPresent: true,
        checkInTime: '08:05',
        checkOutTime: '17:00',
        notes: ''
      }
    ];
    localStorage.setItem('attendanceRecords', JSON.stringify(mockRecords));
  }
};
