
export type UserRole = 'student' | 'school' | 'company';

export interface User {
  id: string;
  name: string;
  role: UserRole;
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
