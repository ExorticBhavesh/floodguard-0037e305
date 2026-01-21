import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FloodAlert } from '@/hooks/useFloodAlerts';
import { PredictionResult } from '@/hooks/useFloodPrediction';

// CSV Export for Alerts
export function exportAlertsToCSV(alerts: FloodAlert[], filename = 'flood-alerts'): void {
  const headers = ['Title', 'Severity', 'Location', 'Description', 'Status', 'Created At', 'Expires At'];
  
  const rows = alerts.map(alert => [
    alert.title,
    alert.severity.toUpperCase(),
    alert.location,
    alert.description.replace(/,/g, ';'), // Escape commas
    alert.is_active ? 'Active' : 'Inactive',
    new Date(alert.created_at).toLocaleString(),
    alert.expires_at ? new Date(alert.expires_at).toLocaleString() : 'N/A'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  downloadFile(csvContent, `${filename}-${formatDate()}.csv`, 'text/csv');
}

// CSV Export for Predictions
export function exportPredictionToCSV(prediction: PredictionResult, locationName = 'Current Location', filename = 'flood-prediction'): void {
  const headers = ['Parameter', 'Value'];
  
  const rows = [
    ['Risk Level', prediction.riskLevel.toUpperCase()],
    ['Probability', `${(prediction.probability * 100).toFixed(1)}%`],
    ['Predicted Water Level', `${prediction.predictedWaterLevel.toFixed(2)}m`],
    ['Confidence Score', `${(prediction.confidenceScore * 100).toFixed(1)}%`],
    ['Evacuation Advised', prediction.evacuationAdvised ? 'Yes' : 'No'],
    ['Time to Flood', prediction.timeToFlood || 'N/A'],
    ['Location', locationName],
    ['Recommendation', prediction.recommendation],
    ['Generated At', new Date().toLocaleString()],
    ['---', '---'],
    ['Contributing Factors', ''],
    ...prediction.factors.map(f => [f.name, `Contribution: ${(f.contribution * 100).toFixed(0)}% (${f.status})`])
  ];

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  downloadFile(csvContent, `${filename}-${formatDate()}.csv`, 'text/csv');
}

// PDF Export for Alerts
export function exportAlertsToPDF(alerts: FloodAlert[], filename = 'flood-alerts'): void {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(0, 122, 185); // Primary blue
  doc.text('FloodGuard Alert Report', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
  doc.text(`Total Alerts: ${alerts.length}`, 14, 36);
  
  // Summary stats
  const critical = alerts.filter(a => a.severity === 'critical').length;
  const high = alerts.filter(a => a.severity === 'high').length;
  const medium = alerts.filter(a => a.severity === 'medium').length;
  const low = alerts.filter(a => a.severity === 'low').length;
  
  doc.setFontSize(11);
  doc.setTextColor(40);
  doc.text(`Summary: ${critical} Critical | ${high} High | ${medium} Medium | ${low} Low`, 14, 44);
  
  // Table
  const tableData = alerts.map(alert => [
    alert.title,
    alert.severity.toUpperCase(),
    alert.location,
    alert.description.substring(0, 60) + (alert.description.length > 60 ? '...' : ''),
    new Date(alert.created_at).toLocaleDateString()
  ]);

  autoTable(doc, {
    head: [['Title', 'Severity', 'Location', 'Description', 'Date']],
    body: tableData,
    startY: 52,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [0, 122, 185], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 18 },
      2: { cellWidth: 30 },
      3: { cellWidth: 70 },
      4: { cellWidth: 22 }
    }
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`FloodGuard - Flood Alert Prediction System | Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.height - 10);
  }

  doc.save(`${filename}-${formatDate()}.pdf`);
}

// PDF Export for Prediction
export function exportPredictionToPDF(prediction: PredictionResult, locationName = 'Current Location', filename = 'flood-prediction'): void {
  const doc = new jsPDF();
  
  // Get risk color
  const riskColors: Record<string, [number, number, number]> = {
    low: [34, 197, 94],
    medium: [245, 158, 11],
    high: [239, 68, 68],
    critical: [220, 38, 38]
  };
  const riskColor = riskColors[prediction.riskLevel] || riskColors.low;
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(0, 122, 185);
  doc.text('FloodGuard Prediction Report', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
  doc.text(`Location: ${locationName}`, 14, 36);
  
  // Risk Level Badge
  doc.setFontSize(14);
  doc.setTextColor(...riskColor);
  doc.text(`Risk Level: ${prediction.riskLevel.toUpperCase()}`, 14, 48);
  
  // Main Stats
  doc.setFontSize(11);
  doc.setTextColor(40);
  let y = 60;
  
  const stats = [
    ['Flood Probability', `${(prediction.probability * 100).toFixed(1)}%`],
    ['Predicted Water Level', `${prediction.predictedWaterLevel.toFixed(2)} meters`],
    ['Model Confidence', `${(prediction.confidenceScore * 100).toFixed(1)}%`],
    ['Evacuation Recommended', prediction.evacuationAdvised ? 'YES - IMMEDIATE ACTION ADVISED' : 'No'],
    ['Estimated Time to Flood', prediction.timeToFlood || 'Not Applicable']
  ];
  
  stats.forEach(([label, value]) => {
    doc.setTextColor(100);
    doc.text(label + ':', 14, y);
    doc.setTextColor(40);
    doc.text(value, 80, y);
    y += 8;
  });
  
  // Recommendation
  y += 5;
  doc.setFontSize(12);
  doc.setTextColor(0, 122, 185);
  doc.text('Recommendation', 14, y);
  y += 8;
  doc.setFontSize(10);
  doc.setTextColor(40);
  
  const recLines = doc.splitTextToSize(prediction.recommendation, 180);
  doc.text(recLines, 14, y);
  y += recLines.length * 6 + 10;
  
  // Contributing Factors
  doc.setFontSize(12);
  doc.setTextColor(0, 122, 185);
  doc.text('Contributing Factors', 14, y);
  y += 5;
  
  const factorData = prediction.factors.map(f => [
    f.name,
    `${(f.contribution * 100).toFixed(0)}%`,
    f.status.toUpperCase()
  ]);

  autoTable(doc, {
    head: [['Factor', 'Contribution', 'Status']],
    body: factorData,
    startY: y,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [0, 122, 185], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] }
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text('FloodGuard - AI-Powered Flood Alert Prediction System', 14, doc.internal.pageSize.height - 10);

  doc.save(`${filename}-${formatDate()}.pdf`);
}

// Helper functions
function formatDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
