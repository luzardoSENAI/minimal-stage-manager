
export type UserRole = 'student' | 'school' | 'company';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface Student {
  id: string;
  name: string;
  company: string;
  contact: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  isPresent: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface Evaluation {
  id: string;
  studentId: string;
  studentName: string;
  evaluatorId: string;
  evaluatorName: string;
  date: string;
  attendance: number;
  socialInteraction: number;
  practicalLearning: number;
  workQuality: number;
  comments?: string;
}
