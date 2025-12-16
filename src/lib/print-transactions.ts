/**
 * Print Transactions Utility
 * Handles printing of case details with transaction history in a formatted table
 */

interface PrintTransactionData {
  id: string;
  payment_date: string;
  transaction_type: "PAYMENT" | "COST";
  payment_amount: string;
  accrued_interest: string;
  principal_balance: string;
  description: string;
}

interface PrintCaseData {
  case_name: string;
  court_name?: string;
  court_number?: string;
  judgment_amount?: number;
  judgment_date?: string;
  lastPaymentDate?: string;
  totalPayments?: number;
  totalInterest?: number;
  todayPayoff?: number;
}

/**
 * Formats currency values for display
 */
const formatPrintCurrency = (value: number | string): string => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return `$${numValue.toFixed(2)}`;
};

/**
 * Formats date for display (MM/DD/YYYY)
 */
const formatPrintDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  try {
    const [year, month, day] = dateString.split("-").map(Number);
    return `${month}/${day}/${year}`;
  } catch {
    return dateString;
  }
};

/**
 * Generates HTML for the print view with case details and transactions
 */
const generatePrintHTML = (
  caseData: PrintCaseData,
  transactions: PrintTransactionData[]
): string => {
  const transactionRows = transactions
    .map(
      (transaction) => `
    <tr>
      <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; font-weight: 500; color: #059669;">
        ${formatPrintDate(transaction.payment_date)}
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">
        <span style="
          display: inline-block;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          ${
            transaction.transaction_type === "PAYMENT"
              ? "background-color: #d1fae5; color: #065f46; border: 1px solid #6ee7b7;"
              : "background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;"
          }
        ">
          ${transaction.transaction_type}
        </span>
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">
        ${formatPrintCurrency(transaction.payment_amount)}
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">
        ${formatPrintCurrency(transaction.accrued_interest)}
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; font-weight: 700;">
        ${formatPrintCurrency(transaction.principal_balance)}
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; font-weight: 700;">
        ${transaction.description || "N/A"}
      </td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Transaction History - ${caseData.case_name}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          padding: 40px;
          color: #1f2937;
          line-height: 1.6;
        }
        
        .print-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .transactions-section {
          margin-top: 0;
        }
        
        .section-title {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 24px;
        }
        
        .transactions-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .transactions-table thead {
          background-color: #f9fafb;
        }
        
        .transactions-table th {
          padding: 12px 16px;
          text-align: left;
          font-size: 12px;
          font-weight: 700;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .transactions-table td {
          font-size: 14px;
          color: #1f2937;
        }
        
        .no-transactions {
          text-align: center;
          padding: 40px;
          color: #9ca3af;
          font-size: 14px;
        }
        
        .print-footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
        }
        
        @media print {
          body {
            padding: 20px;
          }
          
          .print-container {
            max-width: 100%;
          }
          
          .transactions-table {
            page-break-inside: avoid;
          }
          
          .transactions-table tr {
            page-break-inside: avoid;
          }
          
          .case-header {
            page-break-after: avoid;
          }
          
          @page {
            margin: 1cm;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-container">
        <!-- Transactions Section -->
        <div class="transactions-section">
          <h2 class="section-title">Transaction History</h2>
          
          ${
            transactions.length > 0
              ? `
            <table class="transactions-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>TRANSACTION TYPE</th>
                  <th>AMOUNT</th>
                  <th>ACCRUED INTEREST</th>
                  <th>PRINCIPAL BALANCE</th>
                  <th>DESCRIPTION</th>
                </tr>
              </thead>
              <tbody>
                ${transactionRows}
              </tbody>
            </table>
          `
              : `
            <div class="no-transactions">
              No transactions available for this case.
            </div>
          `
          }
        </div>
        
        <!-- Print Footer -->
        <div class="print-footer">
          <p>Generated on ${new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })} at ${new Date().toLocaleTimeString("en-US")}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Main print function - creates a hidden iframe, prints, and removes it
 */
export const printCaseTransactions = (
  caseData: PrintCaseData,
  transactions: PrintTransactionData[]
): void => {
  // Create a hidden iframe for printing
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.top = "-10000px";
  iframe.style.left = "-10000px";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";

  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc) {
    console.error("Failed to create print iframe");
    document.body.removeChild(iframe);
    return;
  }

  // Write content to iframe
  const htmlContent = generatePrintHTML(caseData, transactions);
  iframeDoc.open();
  iframeDoc.write(htmlContent);
  iframeDoc.close();

  // Wait for content to load, then print
  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      // Remove iframe after printing (or if user cancels)
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 250);
  };
};
