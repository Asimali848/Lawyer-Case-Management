import jsPDF from "jspdf";

interface PayoffStatementData {
  caseName: string;
  caseId?: string;
  payoffDate: string;
  principalBalance: number;
  accruedInterest: number;
  totalPayoff: number;
  courtName?: string;
  caseNumber?: string;
  judgmentAmount?: string;
  judgmentDate?: string;
}

/**
 * Formats a date string to M/D/YYYY format
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  } catch {
    return dateString;
  }
}

/**
 * Formats a number as currency
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Generates a payoff statement PDF with professional layout
 */
export async function generatePayoffStatementPDF(
  data: PayoffStatementData
): Promise<void> {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  // const _contentWidth = pageWidth - 2 * margin;
  let yPosition = margin + 10;

  // Set font
  pdf.setFont("helvetica");

  // Title - centered
  pdf.setFontSize(22);
  pdf.setFont("helvetica", "bold");
  const titleText = "PAYOFF STATEMENT";
  const titleWidth = pdf.getTextWidth(titleText);
  pdf.text(titleText, (pageWidth - titleWidth) / 2, yPosition);
  yPosition += 20;

  // Case Information Section
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  yPosition += 5;

  if (data.caseName) {
    pdf.setFont("helvetica", "bold");
    pdf.text("Case Name:", margin, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.text(data.caseName, margin + 40, yPosition);
    yPosition += 8;
  }

  if (data.courtName) {
    pdf.setFont("helvetica", "bold");
    pdf.text("Court Name:", margin, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.text(data.courtName, margin + 40, yPosition);
    yPosition += 8;
  }

  if (data.caseNumber) {
    pdf.setFont("helvetica", "bold");
    pdf.text("Case Number:", margin, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.text(data.caseNumber, margin + 40, yPosition);
    yPosition += 8;
  }

  if (data.judgmentAmount) {
    pdf.setFont("helvetica", "bold");
    pdf.text("Judgment Amount:", margin, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      formatCurrency(parseFloat(data.judgmentAmount)),
      margin + 50,
      yPosition
    );
    yPosition += 8;
  }

  if (data.judgmentDate) {
    pdf.setFont("helvetica", "bold");
    pdf.text("Judgment Date:", margin, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.text(formatDate(data.judgmentDate), margin + 45, yPosition);
    yPosition += 8;
  }

  yPosition += 5;

  // Payoff Date
  pdf.setFont("helvetica", "bold");
  pdf.text("Payoff Date:", margin, yPosition);
  pdf.setFont("helvetica", "normal");
  pdf.text(formatDate(data.payoffDate), margin + 40, yPosition);
  yPosition += 15;

  // Payoff Summary Section
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("PAYOFF SUMMARY", margin, yPosition);
  yPosition += 12;

  // Draw line under heading
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPosition - 7, pageWidth - margin, yPosition - 7);
  yPosition += 8;

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");

  // Principal Balance
  pdf.text("Principal Balance:", margin, yPosition);
  pdf.setFont("helvetica", "bold");
  const principalText = formatCurrency(data.principalBalance);
  pdf.text(
    principalText,
    pageWidth - margin - pdf.getTextWidth(principalText),
    yPosition
  );
  yPosition += 12;

  // Accrued Interest
  pdf.setFont("helvetica", "normal");
  pdf.text("Accrued Interest:", margin, yPosition);
  pdf.setFont("helvetica", "bold");
  const interestText = formatCurrency(data.accruedInterest);
  pdf.text(
    interestText,
    pageWidth - margin - pdf.getTextWidth(interestText),
    yPosition
  );
  yPosition += 12;

  // Total Payoff
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(13);
  pdf.setFont("helvetica", "bold");
  pdf.text("Total Payoff:", margin, yPosition);
  pdf.setFontSize(15);
  const totalText = formatCurrency(data.totalPayoff);
  pdf.text(
    totalText,
    pageWidth - margin - pdf.getTextWidth(totalText),
    yPosition
  );

  // Footer
  const footerY = pageHeight - 15;
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(128, 128, 128);
  pdf.text(
    `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
    pageWidth / 2,
    footerY,
    { align: "center" }
  );

  // Reset text color
  pdf.setTextColor(0, 0, 0);

  // Generate filename
  const safeCaseName = (data.caseName || "Case").replace(/[^a-zA-Z0-9]/g, "_");
  const filename = `payoff-${safeCaseName}.pdf`;

  // Save PDF
  pdf.save(filename);
}

/**
 * Generates payoff statement data from case information
 */
export function createPayoffStatementData(
  caseData: {
    id?: string;
    case_name: string;
    court_name: string;
    court_case_number: string;
    judegment_amount: string;
    judgement_date: string;
    last_payment_date?: string;
    total_payment_to_date?: string;
    interest_to_date?: string;
    today_payoff?: string;
  },
  payoffDate: string,
  principalBalance: number,
  accruedInterest: number
): PayoffStatementData {
  return {
    caseName: caseData.case_name,
    caseId: caseData.id,
    payoffDate,
    principalBalance,
    accruedInterest,
    totalPayoff: principalBalance + accruedInterest,
    courtName: caseData.court_name,
    caseNumber: caseData.court_case_number,
    judgmentAmount: caseData.judegment_amount,
    judgmentDate: caseData.judgement_date,
  };
}
