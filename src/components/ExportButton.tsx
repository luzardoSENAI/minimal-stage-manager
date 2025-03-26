
import React from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { AttendanceRecord } from '@/types';
import { toast } from 'sonner';

interface ExportButtonProps {
  data: AttendanceRecord[];
  format: 'pdf' | 'xlsx';
}

const ExportButton: React.FC<ExportButtonProps> = ({ data, format }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  const getDayOfWeek = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'EEEE', { locale: ptBR });
    } catch (e) {
      return '';
    }
  };

  const exportToExcel = () => {
    // Prepare data for Excel
    const excelData = data.map(record => ({
      'Aluno': record.studentName,
      'Data': formatDate(record.date),
      'Dia da Semana': getDayOfWeek(record.date),
      'Presente': record.isPresent ? 'Sim' : 'Não',
      'Hora de Entrada': record.checkInTime || '',
      'Hora de Saída': record.checkOutTime || '',
      'Observações': record.notes || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Frequência');
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data_blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    
    saveAs(data_blob, `frequencia_estagiarios_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Relatório Excel exportado com sucesso!');
  };

  const exportToPdf = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Relatório de Frequência de Estagiários', 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy', { locale: ptBR })}`, 14, 30);
    
    // Convert data for PDF table
    const tableData = data.map(record => [
      record.studentName,
      formatDate(record.date),
      getDayOfWeek(record.date),
      record.isPresent ? 'Presente' : 'Ausente'
    ]);
    
    // Generate table
    (doc as any).autoTable({
      head: [['Aluno', 'Data', 'Dia da Semana', 'Presente']],
      body: tableData,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 }
    });
    
    doc.save(`frequencia_estagiarios_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('Relatório PDF exportado com sucesso!');
  };

  const handleExport = () => {
    if (data.length === 0) {
      toast.error('Não há dados para exportar');
      return;
    }
    
    if (format === 'xlsx') {
      exportToExcel();
    } else {
      exportToPdf();
    }
  };

  return (
    <Button 
      onClick={handleExport} 
      variant={format === 'xlsx' ? 'default' : 'outline'} 
      size="sm"
      className="text-sm"
    >
      <Download className="h-4 w-4 mr-2" />
      {format === 'xlsx' ? 'Exportar Excel' : 'Exportar PDF'}
    </Button>
  );
};

export default ExportButton;
