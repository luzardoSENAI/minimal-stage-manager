
/**
 * File-based storage utilities for storing and retrieving data
 */

import { Student, AttendanceRecord } from '@/types';

// Save data to a text file using the File System Access API
const saveToFile = async (filename: string, data: any): Promise<void> => {
  try {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: filename,
      types: [
        {
          description: 'JSON Files',
          accept: { 'application/json': ['.json'] },
        },
      ],
    });
    
    const writableStream = await fileHandle.createWritable();
    await writableStream.write(blob);
    await writableStream.close();
    
    // Save the file path to localStorage for future reference
    localStorage.setItem(`${filename}_path`, fileHandle.name);
    
    // Also save to localStorage as a backup
    localStorage.setItem(filename, JSON.stringify(data));
    
    console.log(`Data saved to ${filename} successfully`);
  } catch (err) {
    console.error('Error saving to file:', err);
    // Fallback to localStorage if file system access fails
    localStorage.setItem(filename, JSON.stringify(data));
  }
};

// Load data from a text file
const loadFromFile = async <T>(filename: string, defaultData: T): Promise<T> => {
  try {
    // First try to read from localStorage
    const localData = localStorage.getItem(filename);
    if (localData) {
      return JSON.parse(localData) as T;
    }
    
    return defaultData;
  } catch (err) {
    console.error('Error loading from file:', err);
    return defaultData;
  }
};

// Export functions for students
export const saveStudents = async (students: Student[]): Promise<void> => {
  return saveToFile('students', students);
};

export const loadStudents = async (): Promise<Student[]> => {
  return loadFromFile<Student[]>('students', []);
};

// Export functions for attendance records
export const saveAttendanceRecords = async (records: AttendanceRecord[]): Promise<void> => {
  return saveToFile('attendanceRecords', records);
};

export const loadAttendanceRecords = async (): Promise<AttendanceRecord[]> => {
  return loadFromFile<AttendanceRecord[]>('attendanceRecords', []);
};
