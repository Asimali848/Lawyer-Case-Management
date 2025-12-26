import jsPDF from "jspdf";

// Transaction PDF Generator v2.0 - NEW VERSION
interface TransactionPDFData {
  caseName: string;
  courtCaseNumber: string;
  judgmentAmount: number;
  judgmentDate: string;
  transactions: Array<{
    date: string;
    type: "PAYMENT" | "COST";
    amount: string;
    accruedInterest: string;
    principalBalance: string;
    description?: string;
  }>;
}

/**
 * Formats a date string to MMM. D, YYYY format (e.g., "Jan. 1, 2020")
 */
function formatDateShort(dateString: string): string {
  try {
    const date = new Date(dateString);
    const months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  } catch {
    return dateString;
  }
}

/**
 * Formats a date string to MM-DD-YYYY format for table
 */
function formatDateTable(dateString: string): string {
  try {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  } catch {
    return dateString;
  }
}

/**
 * Formats a number as currency
 */
function formatCurrency(amount: number | string): string {
  const numValue = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);
}

/**
 * Generates the current date in format: MMM. DD, YYYY
 */
function getCurrentDateFormatted(): string {
  const date = new Date();
  const months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

/**
 * Generates a transaction summary PDF matching the provided design
 */
export async function generateTransactionPDF(data: TransactionPDFData): Promise<void> {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const margin = 20;
  let yPosition = 15;

  // Set default font
  pdf.setFont("helvetica");

  // Add logo text at top center
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(16, 185, 129); // Green color for logo
  const logoText = "JudgmentCalc.com";
  const logoWidth = pdf.getTextWidth(logoText);
  pdf.text(logoText, (pageWidth - logoWidth) / 2, yPosition);
  yPosition += 15;

  // Title - "Transaction Summary" - centered and large
  pdf.setFontSize(28);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(37, 99, 235); // Blue color
  const titleText = "Transaction Summary";
  const titleWidth = pdf.getTextWidth(titleText);
  pdf.text(titleText, (pageWidth - titleWidth) / 2, yPosition);
  yPosition += 25;

  // Reset color to black for case details
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);

  // Case details section
  pdf.setFont("helvetica", "bold");
  pdf.text("Case:", margin, yPosition);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.caseName, margin + 15, yPosition);
  yPosition += 8;

  pdf.setFont("helvetica", "bold");
  pdf.text("Court Case Number:", margin, yPosition);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.courtCaseNumber, margin + 52, yPosition);
  yPosition += 8;

  pdf.setFont("helvetica", "bold");
  pdf.text("Judgment Amount:", margin, yPosition);
  pdf.setFont("helvetica", "normal");
  pdf.text(formatCurrency(data.judgmentAmount), margin + 52, yPosition);
  yPosition += 8;

  pdf.setFont("helvetica", "bold");
  pdf.text("Judgment Date:", margin, yPosition);
  pdf.setFont("helvetica", "normal");
  pdf.text(formatDateShort(data.judgmentDate), margin + 42, yPosition);
  yPosition += 15;

  // Table setup
  const tableStartY = yPosition;
  const colWidths = [22, 20, 25, 28, 28, 47]; // Date, Type, Amount, Accrued Interest, Principal Balance, Description
  const colX = [
    margin,
    margin + colWidths[0],
    margin + colWidths[0] + colWidths[1],
    margin + colWidths[0] + colWidths[1] + colWidths[2],
    margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
    margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4],
  ];

  const headerRowHeight = 15;
  const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);

  // Table header background (light blue/gray)
  pdf.setFillColor(224, 242, 254); // Light blue
  pdf.rect(margin, tableStartY, tableWidth, headerRowHeight, "F");

  // Table header text
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 0, 0);

  const headerY = tableStartY + 6;
  pdf.text("Date", colX[0] + 2, headerY + 3);
  pdf.text("Type", colX[1] + 2, headerY + 3);
  pdf.text("Amount", colX[2] + 2, headerY + 3);

  // Stacked headers
  pdf.text("Accrued", colX[3] + 2, headerY + 1);
  pdf.text("Interest", colX[3] + 2, headerY + 5);

  pdf.text("Principal", colX[4] + 2, headerY + 1);
  pdf.text("Balance", colX[4] + 2, headerY + 5);

  pdf.text("Description", colX[5] + 2, headerY + 3);

  yPosition = tableStartY + headerRowHeight;

  // Draw table borders
  pdf.setDrawColor(200, 200, 200); // Light gray border
  pdf.setLineWidth(0.1);

  // Horizontal lines for header
  pdf.line(margin, tableStartY, margin + tableWidth, tableStartY);
  pdf.line(margin, tableStartY + headerRowHeight, margin + tableWidth, tableStartY + headerRowHeight);

  // Vertical lines for header
  for (let i = 0; i <= colWidths.length; i++) {
    const x = i === 0 ? margin : colX[i - 1] + colWidths[i - 1];
    pdf.line(x, tableStartY, x, tableStartY + headerRowHeight);
  }

  // Table rows
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  data.transactions.forEach((transaction, index) => {
    // Calculate required row height based on description
    const description = transaction.description || "N/A";
    const maxDescWidth = colWidths[5] - 4;
    const descLines = pdf.splitTextToSize(description, maxDescWidth);
    const rowHeight = Math.max(10, descLines.length * 5 + 2);

    // Check for page break
    if (yPosition + rowHeight > 270) {
      pdf.addPage();
      yPosition = 20;

      // Redraw header on new page
      pdf.setFillColor(224, 242, 254);
      pdf.rect(margin, yPosition, tableWidth, headerRowHeight, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      const newHeaderY = yPosition + 5;
      pdf.text("Date", colX[0] + 2, newHeaderY + 2);
      pdf.text("Type", colX[1] + 2, newHeaderY + 2);
      pdf.text("Amount", colX[2] + 2, newHeaderY + 2);
      pdf.text("Accrued", colX[3] + 2, newHeaderY);
      pdf.text("Interest", colX[3] + 2, newHeaderY + 4);
      pdf.text("Principal", colX[4] + 2, newHeaderY);
      pdf.text("Balance", colX[4] + 2, newHeaderY + 4);
      pdf.text("Description", colX[5] + 2, newHeaderY + 2);

      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPosition, margin + tableWidth, yPosition);
      pdf.line(margin, yPosition + headerRowHeight, margin + tableWidth, yPosition + headerRowHeight);
      for (let i = 0; i <= colWidths.length; i++) {
        const x = i === 0 ? margin : colX[i - 1] + colWidths[i - 1];
        pdf.line(x, yPosition, x, yPosition + headerRowHeight);
      }
      yPosition += headerRowHeight;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
    }

    // Alternate row background
    if (index % 2 === 0) {
      pdf.setFillColor(249, 250, 251); // Very light gray
      pdf.rect(margin, yPosition, tableWidth, rowHeight, "F");
    }

    // Row data
    pdf.setTextColor(0, 0, 0);
    const verticalOffset = 7;
    pdf.text(formatDateTable(transaction.date), colX[0] + 2, yPosition + verticalOffset);
    pdf.text(transaction.type, colX[1] + 2, yPosition + verticalOffset);
    pdf.text(formatCurrency(transaction.amount), colX[2] + 2, yPosition + verticalOffset);
    pdf.text(formatCurrency(transaction.accruedInterest), colX[3] + 2, yPosition + verticalOffset);
    pdf.text(formatCurrency(transaction.principalBalance), colX[4] + 2, yPosition + verticalOffset);

    // Add description lines
    descLines.forEach((line: string, i: number) => {
      pdf.text(line, colX[5] + 2, yPosition + verticalOffset + i * 5);
    });

    // Draw row border (horizontal line)
    pdf.line(margin, yPosition + rowHeight, margin + tableWidth, yPosition + rowHeight);

    // Draw vertical lines for this row
    for (let i = 0; i <= colWidths.length; i++) {
      const x = i === 0 ? margin : colX[i - 1] + colWidths[i - 1];
      pdf.line(x, yPosition, x, yPosition + rowHeight);
    }

    yPosition += rowHeight;
  });

  // Footer
  yPosition += 20;
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(100, 100, 100); // Gray color
  const footerText = `Generated by JudgmentCalc.com — ${getCurrentDateFormatted()}`;
  const footerWidth = pdf.getTextWidth(footerText);
  pdf.text(footerText, (pageWidth - footerWidth) / 2, yPosition);

  // Generate filename
  const safeCaseName = data.caseName.replace(/[^a-zA-Z0-9]/g, "_");
  const filename = `Transaction_Summary_${safeCaseName}.pdf`;

  // Save the PDF
  pdf.save(filename);
}

/**
 * Helper function to create transaction PDF data from calculation
 */
export function createTransactionPDFData(
  calculation: any,
  transactions: Array<{
    payment_date: string;
    transaction_type: "PAYMENT" | "COST";
    payment_amount: string;
    accrued_interest: string;
    principal_balance: string;
    description?: string;
  }>,
): TransactionPDFData {
  return {
    caseName: calculation.case_name || "N/A",
    courtCaseNumber: calculation.court_number || "N/A",
    judgmentAmount: calculation.judgment_amount || 0,
    judgmentDate: calculation.judgment_date || "",
    transactions: transactions.map((t) => ({
      date: t.payment_date,
      type: t.transaction_type,
      amount: t.payment_amount,
      accruedInterest: t.accrued_interest,
      principalBalance: t.principal_balance,
      description: t.description,
    })),
  };
}
