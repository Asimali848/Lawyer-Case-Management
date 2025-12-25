import {
  AlignmentType,
  BorderStyle,
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

interface PayoffDocData {
  case_id: string;
  case_name?: string;
  client_name?: string;
  court_name?: string;
  court_case_number?: string;
  judgment_amount: number;
  judgment_date: string;
  payoff_date: string;
  lawyer_name?: string;
  firm_name?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  lawyer_phone?: string;
  lawyer_email?: string;
  principal_balance: number;
  accrued_interest: number;
  total_payoff: number;
  daily_interest_rate: number;
  daily_interest_amount: number;
  annual_interest_rate: number;
}

/**
 * Formats a date string to M/D/YYYY format
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
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
 * Generates a payoff statement Word document
 */
export async function generatePayoffDoc(data: PayoffDocData): Promise<void> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header: Logo
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "JudgmentCalc.com",
                bold: true,
                color: "10B981", // Green
                size: 24, // 12pt
              }),
            ],
          }),
          new Paragraph({ text: "" }),

          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "Payoff Statement",
                bold: true,
                color: "003366", // Dark Blue
                size: 48, // 24pt
              }),
            ],
          }),

          // Horizontal Line (simulated with border on paragraph)
          new Paragraph({
            border: {
              bottom: {
                color: "003366",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
          }),
          new Paragraph({ text: "" }),

          // Date
          new Paragraph({
            children: [
              new TextRun({ text: "Date: ", bold: true }),
              new TextRun({ text: formatDate(new Date().toISOString()) }),
            ],
          }),
          new Paragraph({ text: "" }),

          // Creditor & Debtor Information (Two columns via Table)
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  // Creditor Info
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: data.client_name || "Creditor Name", bold: true, size: 24 })],
                      }),
                      ...(data.firm_name
                        ? [new Paragraph({ children: [new TextRun({ text: data.firm_name, size: 20 })] })]
                        : []),
                      ...(data.street_address
                        ? [new Paragraph({ children: [new TextRun({ text: data.street_address, size: 20 })] })]
                        : []),
                      ...(data.city && data.state
                        ? [
                            new Paragraph({
                              children: [
                                new TextRun({ text: `${data.city}, ${data.state} ${data.zipcode || ""}`, size: 20 }),
                              ],
                            }),
                          ]
                        : []),
                      ...(data.lawyer_phone
                        ? [
                            new Paragraph({
                              children: [
                                new TextRun({ text: "Tel: ", bold: true, size: 20 }),
                                new TextRun({ text: data.lawyer_phone, size: 20 }),
                              ],
                            }),
                          ]
                        : []),
                      ...(data.lawyer_email
                        ? [
                            new Paragraph({
                              children: [
                                new TextRun({ text: "Email: ", bold: true, size: 20 }),
                                new TextRun({ text: data.lawyer_email, color: "0000FF", size: 20 }),
                              ],
                            }),
                          ]
                        : []),
                    ],
                  }),
                  // Debtor Info
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Debtor Information:", bold: true, size: 22 })],
                      }),
                      new Paragraph({ children: [new TextRun({ text: "Phone: N/A", size: 20 })] }),
                      new Paragraph({ children: [new TextRun({ text: "Email: N/A", size: 20 })] }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),

          // Case Details Section
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "Case Details", bold: true, color: "003366", size: 28 })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: data.case_name || "N/A", bold: true, size: 22 })],
          }),
          ...(data.court_name
            ? [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: `${data.court_name} - Case No. ${data.court_case_number || "N/A"}`, size: 20 }),
                  ],
                }),
              ]
            : []),
          new Paragraph({ text: "" }),

          // Judgment Details (Centered Table)
          new Table({
            alignment: AlignmentType.CENTER,
            width: { size: 80, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [new TextRun({ text: "Judgment Amount:", bold: true, size: 20 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: `  ${formatCurrency(data.judgment_amount)}`, size: 20 })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [new TextRun({ text: "Judgment Date:", bold: true, size: 20 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: `  ${formatDate(data.judgment_date)}`, size: 20 })],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),

          // Total Payoff Box (Table with shading)
          new Table({
            alignment: AlignmentType.CENTER,
            width: { size: 70, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "E6F0FF", type: ShadingType.CLEAR, color: "auto" },
                    verticalAlign: VerticalAlign.CENTER,
                    margins: { top: 200, bottom: 200 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "Total Payoff", bold: true, size: 26 })],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: formatCurrency(data.total_payoff),
                            bold: true,
                            color: "006600",
                            size: 32,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: `As of ${formatDate(data.payoff_date)}`, italics: true, size: 18 })],
          }),
          new Paragraph({ text: "" }),

          // Interest Accrual Notice
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Interest accrues at a daily rate of ${formatCurrency(data.daily_interest_amount)} per day after ${formatDate(data.payoff_date)}.`,
                size: 20,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),

          // Payment Instructions
          new Paragraph({
            children: [
              new TextRun({ text: "Please ensure your payment reaches our office by the stated date.", size: 18 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "If paying by check, mail it to the address listed. For wire instructions, contact our office.",
                size: 18,
              }),
            ],
          }),
          new Paragraph({ text: "" }),

          // Footer
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
                color: "808080",
                size: 16,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeCaseName = (data.case_name || "Case").replace(/[^a-zA-Z0-9]/g, "_");
  const safeDate = data.payoff_date.replace(/[^0-9]/g, "");
  saveAs(blob, `Payoff_Statement_${safeCaseName}_${safeDate}.docx`);
}
