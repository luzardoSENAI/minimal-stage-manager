
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  selectedStudentsIds?: string[];
  setSelectedStudentsIds?: (ids: string[] | ((prev: string[]) => string[])) => void;
  selectionMode?: 'single' | 'multiple' | 'all';
  setSelectionMode?: (mode: 'single' | 'multiple' | 'all') => void;
}

const StudentSelector: React.FC<StudentSelectorProps> = ({ 
  students, 
  selectedStudentId, 
  setSelectedStudentId,
  selectedStudentsIds = [],
  setSelectedStudentsIds = () => {},
  selectionMode = 'single',
  setSelectionMode = () => {}
}) => {
  const handleSelectAllStudents = () => {
    if (selectedStudentsIds.length === students.length) {
      setSelectedStudentsIds([]);
    } else {
      setSelectedStudentsIds(students.map(student => student.id));
    }
  };

  const handleStudentCheckChange = (studentId: string) => {
    setSelectedStudentsIds((prev: string[]) => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleModeChange = (value: string) => {
    setSelectionMode(value as 'single' | 'multiple' | 'all');
    
    if (value === 'all') {
      setSelectedStudentId(null);
      setSelectedStudentsIds(students.map(student => student.id));
    } else if (value === 'single') {
      setSelectedStudentsIds([]);
      setSelectedStudentId(null);
    } else {
      setSelectedStudentId(null);
      setSelectedStudentsIds([]);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs 
        defaultValue={selectionMode} 
        value={selectionMode} 
        onValueChange={handleModeChange} 
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="single">Individual</TabsTrigger>
          <TabsTrigger value="multiple">Grupo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-2">
          <p className="text-sm text-muted-foreground">
            O registro será aplicado a todos os {students.length} alunos.
          </p>
        </TabsContent>
        
        <TabsContent value="single" className="pt-2">
          <Select
            value={selectedStudentId || ""}
            onValueChange={setSelectedStudentId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecionar aluno" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Alunos</SelectLabel>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </TabsContent>
        
        <TabsContent value="multiple" className="pt-2">
          <div className="border rounded-md">
            <div className="flex items-center p-3 border-b">
              <Checkbox 
                id="select-all-students"
                checked={selectedStudentsIds.length === students.length && students.length > 0}
                onCheckedChange={handleSelectAllStudents}
              />
              <label htmlFor="select-all-students" className="ml-2 text-sm font-medium cursor-pointer">
                Selecionar todos os alunos
              </label>
              <span className="ml-auto text-xs text-muted-foreground">
                {selectedStudentsIds.length} de {students.length} selecionados
              </span>
            </div>
            <ScrollArea className="h-[200px] p-2">
              <div className="space-y-2 p-1">
                {students.map(student => (
                  <div key={student.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`student-${student.id}`}
                      checked={selectedStudentsIds.includes(student.id)} 
                      onCheckedChange={() => handleStudentCheckChange(student.id)}
                    />
                    <label 
                      htmlFor={`student-${student.id}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {student.name}
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentSelector;
