import { Document, Packer, Paragraph, TextRun } from "docx";
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
          // Re: Payoff Statement – Case Name, Case No. CASE NUMBER
          new Paragraph({
            children: [
              new TextRun({
                text: `Re: Payoff Statement – ${
                  data.case_name || "Case Name"
                }, Case No. ${data.court_case_number || "N/A"}`,
                bold: true,
              }),
            ],
          }),
          new Paragraph({ text: "" }),

          // You requested a payoff calculation for the above-referenced matter with an anticipated payment date of DATE.
          new Paragraph({
            children: [
              new TextRun({
                text: "You requested a payoff calculation for the above-referenced matter with an anticipated payment date of ",
              }),
              new TextRun({
                text: formatDate(data.payoff_date),
              }),
              new TextRun({ text: "." }),
            ],
          }),
          new Paragraph({ text: "" }),

          // As of that date, the total amount required to fully satisfy the judgment is $PAYOFF AMOUNT, which includes the following:
          new Paragraph({
            children: [
              new TextRun({
                text: "As of that date, the total amount required to fully satisfy the judgment is ",
              }),
              new TextRun({
                text: formatCurrency(data.total_payoff),
                bold: true,
              }),
              new TextRun({
                text: ", which includes the following:",
              }),
            ],
          }),
          new Paragraph({ text: "" }),

          // Principal: $PRINCIPAL
          new Paragraph({
            bullet: {
              level: 0,
            },
            children: [
              new TextRun({
                text: "Principal: ",
                bold: true,
              }),
              new TextRun({
                text: formatCurrency(data.principal_balance),
              }),
            ],
          }),

          // Accrued Interest: $TOTAL INTEREST
          new Paragraph({
            bullet: {
              level: 0,
            },
            children: [
              new TextRun({
                text: "Accrued Interest: ",
                bold: true,
              }),
              new TextRun({
                text: formatCurrency(data.accrued_interest),
              }),
            ],
          }),
          new Paragraph({ text: "" }),

          // If payment is received after DATE, please increase the total amount by $DAILY INTEREST for each additional day to account for continuing interest.
          new Paragraph({
            children: [
              new TextRun({
                text: "If payment is received after ",
              }),
              new TextRun({
                text: formatDate(data.payoff_date),
                bold: true,
              }),
              new TextRun({
                text: ", please increase the total amount by ",
              }),
              new TextRun({
                text: formatCurrency(data.daily_interest_amount),
                bold: true,
              }),
              new TextRun({
                text: " for each additional day to account for continuing interest.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),

          // Please don't hesitate to reach out if you have any questions.
          new Paragraph({
            children: [
              new TextRun({
                text: "Please don't hesitate to reach out if you have any questions.",
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
