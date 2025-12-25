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
  judgmentAmount?: string | number;
  judgmentDate?: string;
  clientName?: string;
  firmName?: string;
  lawyerName?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  lawyerPhone?: string;
  lawyerEmail?: string;
  dailyInterestRate?: number;
  dailyInterestAmount?: number;
  annualInterestRate?: number;
  profilePictureUrl?: string | null;
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
 * Generates a payoff statement PDF matching the provided design
 */
export async function generatePayoffStatementPDF(data: PayoffStatementData): Promise<void> {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  let yPosition = margin;

  // Set font
  pdf.setFont("helvetica");

  // ===== HEADER: PAYOFF STATEMENT =====
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 51, 102); // Dark blue
  const titleText = "Payoff Statement";
  const titleWidth = pdf.getTextWidth(titleText);
  pdf.text(titleText, (pageWidth - titleWidth) / 2, yPosition);

  // Draw line under title
  yPosition += 3;
  pdf.setDrawColor(0, 51, 102);
  pdf.setLineWidth(0.8);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 12;

  // ===== DATE AND PROFILE PICTURE =====
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 0, 0);
  pdf.text("Date:", margin, yPosition);
  pdf.setFont("helvetica", "normal");
  pdf.text(formatDate(new Date().toISOString()), margin + 15, yPosition);

  // Add profile picture on the right if available
  if (data.profilePictureUrl) {
    try {
      const imgSize = 30; // 30mm square
      const imgX = pageWidth - margin - imgSize;
      const imgY = yPosition - 8; // Align with date section

      // Add image (jsPDF supports data URLs and external URLs)
      pdf.addImage(data.profilePictureUrl, "JPEG", imgX, imgY, imgSize, imgSize);
    } catch (_error) {}
  }

  yPosition += 12;

  // ===== CREDITOR INFORMATION (Left Column) =====
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text(data.clientName || "Creditor Name", margin, yPosition);
  yPosition += 6;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");

  if (data.firmName) {
    pdf.text(data.firmName, margin, yPosition);
    yPosition += 5;
  }

  if (data.streetAddress || (data.city && data.state)) {
    if (data.streetAddress) {
      pdf.text(data.streetAddress, margin, yPosition);
      yPosition += 5;
    }
    if (data.city && data.state) {
      pdf.text(`${data.city}, ${data.state} ${data.zipcode || ""}`.trim(), margin, yPosition);
      yPosition += 5;
    }
  } else {
    pdf.text("N/A", margin, yPosition);
    yPosition += 5;
  }

  if (data.lawyerPhone) {
    pdf.setFont("helvetica", "bold");
    pdf.text("Tel:", margin, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.text(data.lawyerPhone, margin + 10, yPosition);
    yPosition += 5;
  }

  if (data.lawyerEmail) {
    pdf.setFont("helvetica", "bold");
    pdf.text("Email:", margin, yPosition);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 255); // Blue for email
    pdf.text(data.lawyerEmail, margin + 14, yPosition);
    pdf.setTextColor(0, 0, 0);
    yPosition += 5;
  }

  // ===== DEBTOR INFORMATION =====
  yPosition += 8;
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("Debtor Information:", margin, yPosition);
  yPosition += 6;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text("Phone: N/A", margin, yPosition);
  yPosition += 5;
  pdf.text("Email: N/A", margin, yPosition);
  yPosition += 12;

  // ===== CASE DETAILS SECTION =====
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 51, 102);
  pdf.text("Case Details", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 8;

  // Case details box
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 0, 0);

  if (data.caseName) {
    pdf.text(data.caseName, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 7;
  }

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");

  if (data.courtName) {
    pdf.text(`${data.courtName} - Case No. ${data.caseNumber || "N/A"}`, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;
  }

  // Judgment details
  const leftColX = margin + 20;

  pdf.setFont("helvetica", "bold");
  pdf.text("Judgment Amount:", leftColX, yPosition);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    formatCurrency(
      typeof data.judgmentAmount === "string" ? parseFloat(data.judgmentAmount) : data.judgmentAmount || 0,
    ),
    leftColX + 45,
    yPosition,
  );
  yPosition += 6;

  if (data.judgmentDate) {
    pdf.setFont("helvetica", "bold");
    pdf.text("Judgment Date:", leftColX, yPosition);
    pdf.setFont("helvetica", "normal");
    const jdgDate = formatDate(data.judgmentDate);
    pdf.text(`${jdgDate} (entered Jan. 1, 2020)`, leftColX + 45, yPosition);
    yPosition += 12;
  }

  // ===== TOTAL PAYOFF BOX =====
  const boxY = yPosition;
  const boxHeight = 25;
  const boxWidth = pageWidth - 2 * margin - 30;
  const boxX = margin + 15;

  // Draw blue background box
  pdf.setFillColor(230, 240, 255);
  pdf.rect(boxX, boxY, boxWidth, boxHeight, "F");

  // Draw border
  pdf.setDrawColor(0, 51, 102);
  pdf.setLineWidth(0.5);
  pdf.rect(boxX, boxY, boxWidth, boxHeight);

  // Total Payoff text
  yPosition = boxY + 10;
  pdf.setFontSize(13);
  pdf.setFont("helvetica", "bold");
  pdf.text("Total Payoff", pageWidth / 2, yPosition, { align: "center" });

  yPosition += 10;
  pdf.setFontSize(16);
  pdf.setTextColor(0, 102, 0); // Green
  pdf.text(formatCurrency(data.totalPayoff), pageWidth / 2, yPosition, {
    align: "center",
  });
  pdf.setTextColor(0, 0, 0);

  yPosition = boxY + boxHeight + 8;
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "italic");
  pdf.text(`As of ${formatDate(data.payoffDate)}`, pageWidth / 2, yPosition, {
    align: "center",
  });
  yPosition += 10;

  // ===== INTEREST ACCRUAL NOTICE =====
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(0, 0, 0);

  const dailyRate = Number(data.dailyInterestRate) || 0;
  const dailyAmount = Number(data.dailyInterestAmount || Number(data.principalBalance) * dailyRate);

  const interestText = `Interest accrues at a daily rate of $${dailyAmount.toFixed(
    2,
  )} per day after ${formatDate(data.payoffDate)}.`;
  pdf.text(interestText, pageWidth / 2, yPosition, { align: "center" });
  yPosition += 12;

  // ===== PAYMENT INSTRUCTIONS =====
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text("Please ensure your payment reaches our office by the stated date.", margin, yPosition);
  yPosition += 6;
  pdf.text(
    "If paying by check, mail it to the address listed. For wire instructions, contact our office.",
    margin,
    yPosition,
  );
  yPosition += 15;

  // ===== FOOTER =====
  const footerY = pageHeight - 15;
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text(
    `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
    pageWidth / 2,
    footerY,
    { align: "center" },
  );

  // Reset colors
  pdf.setTextColor(0, 0, 0);

  // Generate filename
  const safeCaseName = (data.caseName || "Case").replace(/[^a-zA-Z0-9]/g, "_");
  const safeDate = data.payoffDate.replace(/[^0-9]/g, "");
  const filename = `Payoff_Statement_${safeCaseName}_${safeDate}.pdf`;

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
  accruedInterest: number,
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
