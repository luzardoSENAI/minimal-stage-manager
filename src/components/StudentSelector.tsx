
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Student {
  id: string;
  name: string;
  company: string;
  contact: string;
}

interface StudentSelectorProps {
  students: Student[];
  selectedStudentId: string | null;
  setSelectedStudentId: (id: string | null) => void;
}

const StudentSelector: React.FC<StudentSelectorProps> = ({ 
  students, 
  selectedStudentId, 
  setSelectedStudentId 
}) => {
  return (
    <div className="w-[220px]">
      <Select
        value={selectedStudentId || ""}
        onValueChange={(value) => setSelectedStudentId(value === "" ? null : value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecionar aluno" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Alunos</SelectLabel>
            <SelectItem value="">Todos os alunos</SelectItem>
            {students.map((student) => (
              <SelectItem key={student.id} value={student.id}>
                {student.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StudentSelector;
