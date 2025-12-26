import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";

interface TransactionDocData {
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
 * Formats a date string to MMM. D, YYYY format
 */
function formatDateShort(dateString: string): string {
  try {
    const date = new Date(dateString);
    const months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
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
 * Generates a transaction summary Word document
 */
export async function generateTransactionDoc(data: TransactionDocData): Promise<void> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Logo text
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "JudgmentCalc.com",
                bold: true,
                color: "10B981", // Green color
                size: 24, // 12pt
              }),
            ],
          }),
          new Paragraph({ text: "" }), // Spacing

          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "Transaction Summary",
                bold: true,
                color: "2563EB", // Blue color
                size: 56, // 28pt
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),

          // Case Details
          new Paragraph({
            children: [new TextRun({ text: "Case: ", bold: true }), new TextRun({ text: data.caseName })],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Court Case Number: ", bold: true }),
              new TextRun({ text: data.courtCaseNumber }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Judgment Amount: ", bold: true }),
              new TextRun({ text: formatCurrency(data.judgmentAmount) }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Judgment Date: ", bold: true }),
              new TextRun({ text: formatDateShort(data.judgmentDate) }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),

          // Transactions Table
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              // Header Row
              new TableRow({
                children: [
                  createTableCell("Date", true, true),
                  createTableCell("Type", true, true),
                  createTableCell("Amount", true, true),
                  createTableCell("Accrued Interest", true, true),
                  createTableCell("Principal Balance", true, true),
                  createTableCell("Description", true, true),
                ],
              }),
              // Data Rows
              ...data.transactions.map(
                (t, index) =>
                  new TableRow({
                    children: [
                      createTableCell(formatDateTable(t.date), false, index % 2 === 0),
                      createTableCell(t.type, false, index % 2 === 0),
                      createTableCell(formatCurrency(t.amount), false, index % 2 === 0),
                      createTableCell(formatCurrency(t.accruedInterest), false, index % 2 === 0),
                      createTableCell(formatCurrency(t.principalBalance), false, index % 2 === 0),
                      createTableCell(t.description || "N/A", false, index % 2 === 0),
                    ],
                  }),
              ),
            ],
          }),

          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),

          // Footer
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Generated by JudgmentCalc.com — ${new Date().toLocaleDateString()}`,
                color: "646464",
                size: 18, // 9pt
              }),
            ],
          }),
        ],
      },
    ],
  });

  // Export to file
  const blob = await Packer.toBlob(doc);
  const safeCaseName = data.caseName.replace(/[^a-zA-Z0-9]/g, "_");
  saveAs(blob, `Transaction_Summary_${safeCaseName}.docx`);
}

/**
 * Helper to create a table cell with optional bold and background color
 */
function createTableCell(text: string, bold: boolean, alternate: boolean): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: text,
            bold: bold,
            size: 20, // 10pt
          }),
        ],
        alignment: AlignmentType.LEFT,
      }),
    ],
    shading: alternate
      ? {
          fill: "F9FAFB",
          type: ShadingType.CLEAR,
          color: "auto",
        }
      : bold
        ? {
            fill: "E0F2FE", // Header blue
            type: ShadingType.CLEAR,
            color: "auto",
          }
        : undefined,
    verticalAlign: VerticalAlign.CENTER,
    margins: {
      top: 100,
      bottom: 100,
      left: 100,
      right: 100,
    },
  });
}
