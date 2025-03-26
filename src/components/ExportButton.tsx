
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AttendanceRecord } from '@/types';

type ExportFormat = 'pdf' | 'xlsx';

interface ExportButtonProps {
  data: AttendanceRecord[];
  dateRange: { from: Date | undefined; to: Date | undefined };
}

const ExportButton: React.FC<ExportButtonProps> = ({ data, dateRange }) => {
  const exportData = (format: ExportFormat) => {
    if (format === 'pdf') {
      exportToPDF(data);
    } else if (format === 'xlsx') {
      exportToExcel(data);
    }
  };

  const exportToPDF = (records: AttendanceRecord[]) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Relatório de Frequência', 14, 22);
    
    // Add date range if available
    if (dateRange.from && dateRange.to) {
      doc.setFontSize(12);
      const fromDate = dateRange.from.toLocaleDateString('pt-BR');
      const toDate = dateRange.to.toLocaleDateString('pt-BR');
      doc.text(`Período: ${fromDate} a ${toDate}`, 14, 30);
    }

    // Prepare data for table
    const tableColumn = ["Nome", "Data", "Presente", "Entrada", "Saída", "Observações"];
    const tableRows = records.map(record => [
      record.studentName,
      new Date(record.date).toLocaleDateString('pt-BR'),
      record.isPresent ? 'Sim' : 'Não',
      record.checkInTime || '-',
      record.checkOutTime || '-',
      record.notes || '-'
    ]);

    // Add table to PDF
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: dateRange.from && dateRange.to ? 35 : 30,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 }
    });

    // Save the PDF
    doc.save('relatorio-frequencia.pdf');
  };

  const exportToExcel = (records: AttendanceRecord[]) => {
    // Prepare data for Excel
    const excelData = records.map(record => ({
      'Nome': record.studentName,
      'Data': new Date(record.date).toLocaleDateString('pt-BR'),
      'Presente': record.isPresent ? 'Sim' : 'Não',
      'Entrada': record.checkInTime || '-',
      'Saída': record.checkOutTime || '-',
      'Observações': record.notes || '-'
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Frequência');

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Save the file
    saveAs(data, 'relatorio-frequencia.xlsx');
  };

  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => exportData('pdf')}
        className="flex items-center space-x-1"
      >
        <Download size={16} />
        <span>PDF</span>
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => exportData('xlsx')}
        className="flex items-center space-x-1"
      >
        <Download size={16} />
        <span>Excel</span>
      </Button>
    </div>
  );
};

export default ExportButton;
