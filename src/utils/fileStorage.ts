
// File storage utilities
// This uses localStorage as a simple "database" system

// Types import
import { Student, AttendanceRecord } from '@/types';

// Student storage functions
export const loadStudents = async (): Promise<Student[]> => {
  try {
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
      return JSON.parse(storedStudents);
    }
    return [];
  } catch (err) {
    console.error('Error loading students from storage:', err);
    return [];
  }
};

export const saveStudents = async (students: Student[]): Promise<void> => {
  try {
    localStorage.setItem('students', JSON.stringify(students));
  } catch (err) {
    console.error('Error saving students to storage:', err);
  }
};

// Attendance records storage functions
export const loadAttendanceRecords = async (): Promise<AttendanceRecord[]> => {
  try {
    const storedRecords = localStorage.getItem('attendanceRecords');
    if (storedRecords) {
      return JSON.parse(storedRecords);
    }
    return [];
  } catch (err) {
    console.error('Error loading attendance records from storage:', err);
    return [];
  }
};

export const saveAttendanceRecords = async (records: AttendanceRecord[]): Promise<void> => {
  try {
    localStorage.setItem('attendanceRecords', JSON.stringify(records));
  } catch (err) {
    console.error('Error saving attendance records to storage:', err);
  }
};
