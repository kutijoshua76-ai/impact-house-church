import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Utility to export data to a PDF table
 * @param title The title shown at the top of the PDF
 * @param headers Array of column headers
 * @param rows Array of data rows (each row is an array of strings/numbers)
 * @param fileName The name of the downloaded file (without .pdf)
 */
export const exportToPDF = (title: string, headers: string[], rows: any[][], fileName: string) => {
  const doc = new jsPDF();
  
  // Add Church Branding/Title
  doc.setFont('serif', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(20, 20, 20);
  doc.text("RCCG IMPACT HOUSE", 14, 20);
  
  doc.setFontSize(14);
  doc.setTextColor(226, 176, 145); // Rose Gold
  doc.text(title.toUpperCase(), 14, 30);
  
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 38);
  
  // Horizontal line
  doc.setDrawColor(226, 176, 145);
  doc.line(14, 42, 196, 42);
  
  // Generate table
  autoTable(doc, {
    startY: 50,
    head: [headers],
    body: rows,
    theme: 'grid',
    headStyles: { 
      fillColor: [226, 176, 145], 
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    styles: { 
      fontSize: 8,
      cellPadding: 3,
      valign: 'middle'
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    },
    margin: { top: 50 }
  });
  
  // Footer with page numbers
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  doc.save(`${fileName}_${new Date().getTime()}.pdf`);
};
