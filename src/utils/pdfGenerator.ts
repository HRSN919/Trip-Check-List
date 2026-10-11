import { jsPDF } from 'jspdf';
import { Trip, TripItem } from '../types';
import { CATEGORY_METADATA } from '../data/initialData';

export interface PdfExportOptions {
  includePacked: boolean;
  includeWeights: boolean;
  includeNotes: boolean;
  language: 'fa' | 'en';
}

export function generateTripPdf(trip: Trip, options: PdfExportOptions = {
  includePacked: true,
  includeWeights: true,
  includeNotes: true,
  language: 'fa',
}): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = margin;

  // Header background banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Accent line
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.rect(0, 38, pageWidth, 2.5, 'F');

  // Title in header
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  const appBrand = 'TRIPPACK - TRIP EQUIPMENT CHECKLIST';
  doc.text(appBrand, margin, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Developer Site: byhrsn.com | Smart Packing List', margin, 27);

  const dateStr = new Date().toLocaleDateString('en-CA');
  doc.text(`Date: ${dateStr}`, pageWidth - margin - 35, 27);

  y = 48;

  // Trip Summary Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 26, 3, 3, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Trip: ${trip.title}`, margin + 5, y + 8);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Destination: ${trip.destination || 'N/A'}`, margin + 5, y + 15);
  doc.text(`Dates: ${trip.startDate} - ${trip.endDate}`, margin + 5, y + 21);

  const packedCount = trip.items.filter(i => i.isPacked).length;
  const totalCount = trip.items.length;
  const percent = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;
  const totalWeightKg = (trip.items.reduce((acc, i) => acc + (i.weightGrams || 0), 0) / 1000).toFixed(1);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text(`Progress: ${packedCount}/${totalCount} (${percent}%)`, pageWidth - margin - 50, y + 15);
  doc.setTextColor(15, 23, 42);
  doc.text(`Est. Total Weight: ${totalWeightKg} kg`, pageWidth - margin - 50, y + 21);

  y += 34;

  // Table header
  doc.setFillColor(30, 41, 59);
  doc.rect(margin, y, pageWidth - (margin * 2), 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');

  doc.text('Status', margin + 3, y + 5.5);
  doc.text('Item Description', margin + 24, y + 5.5);
  doc.text('Category', margin + 105, y + 5.5);
  doc.text('Qty', margin + 145, y + 5.5);
  doc.text('Weight', margin + 160, y + 5.5);

  y += 8;

  // Items rows
  trip.items.forEach((item, index) => {
    // Check page overflow
    if (y > pageHeight - 25) {
      doc.addPage();
      y = margin;
      // Re-print small subhead
      doc.setFillColor(30, 41, 59);
      doc.rect(margin, y, pageWidth - (margin * 2), 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('Status', margin + 3, y + 5.5);
      doc.text('Item Description', margin + 24, y + 5.5);
      doc.text('Category', margin + 105, y + 5.5);
      doc.text('Qty', margin + 145, y + 5.5);
      doc.text('Weight', margin + 160, y + 5.5);
      y += 8;
    }

    // Row alternating background
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, pageWidth - (margin * 2), 8.5, 'F');
    }

    // Border line bottom
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + 8.5, pageWidth - margin, y + 8.5);

    // Status box
    doc.setDrawColor(148, 163, 184);
    doc.rect(margin + 4, y + 1.8, 4.5, 4.5);
    if (item.isPacked) {
      doc.setTextColor(16, 185, 129);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('✓', margin + 4.8, y + 5.2);
    }

    // Item name
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    const cleanName = item.name.length > 44 ? item.name.substring(0, 42) + '...' : item.name;
    doc.text(cleanName, margin + 24, y + 5.5);

    // Category
    const catLabel = CATEGORY_METADATA[item.category]?.enLabel || item.category;
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.text(catLabel, margin + 105, y + 5.5);

    // Quantity
    doc.setTextColor(30, 41, 59);
    doc.text(`${item.quantity}x`, margin + 146, y + 5.5);

    // Weight
    const wStr = item.weightGrams ? `${item.weightGrams}g` : '-';
    doc.text(wStr, margin + 160, y + 5.5);

    y += 8.5;
  });

  // Footer on bottom
  const footerY = pageHeight - 12;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('TripPack Mobile Checklist • Powered by byhrsn.com • All rights reserved', margin, footerY);
  doc.text(`Page 1 of ${doc.getNumberOfPages()}`, pageWidth - margin - 22, footerY);

  // Trigger download
  const safeTitle = trip.title.replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_').substring(0, 25);
  doc.save(`TripPack_${safeTitle || 'GearList'}.pdf`);
}

export function triggerBrowserPrint(): void {
  window.print();
}
