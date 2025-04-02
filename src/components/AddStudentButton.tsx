
import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { Student } from '@/types';
import { saveStudents } from '@/utils/fileStorage';

interface AddStudentButtonProps {
  onStudentAdded?: (student: Student) => void;
}

const AddStudentButton: React.FC<AddStudentButtonProps> = ({ onStudentAdded }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [contact, setContact] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !company || !contact) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    // Create new student object
    const newStudent: Student = {
      id: `${Date.now()}`,
      name,
      company,
      contact
    };
    
    try {
      // Get existing students from localStorage
      const storedStudents = localStorage.getItem('students');
      const existingStudents: Student[] = storedStudents ? JSON.parse(storedStudents) : [];
      
      // Add new student to the list
      const updatedStudents = [...existingStudents, newStudent];
      
      // Save to text file
      await saveStudents(updatedStudents);
      
      // Notify parent component about the new student
      if (onStudentAdded) {
        onStudentAdded(newStudent);
      }
      
      toast.success('Aluno cadastrado com sucesso!');
      setOpen(false);
      
      // Limpa o formulário
      setName('');
      setCompany('');
      setContact('');
    } catch (err) {
      console.error('Error saving student:', err);
      toast.error('Erro ao salvar o aluno. Tente novamente.');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Aluno
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Cadastro de Novo Aluno</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo aluno abaixo.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Empresa
              </Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact" className="text-right">
                Contato
              </Label>
              <Input
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit">Cadastrar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentButton;
