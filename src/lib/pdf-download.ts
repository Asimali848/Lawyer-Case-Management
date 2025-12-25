import { downloadPayoffStatementPDF as downloadPayoffPDFFromAPI } from "./api";

/**
 * Downloads a payoff statement PDF - Uses backend PDF generation
 */
export async function downloadPayoffStatementPDF(calculationId: string, payoffDate: string): Promise<void> {
  try {
    await downloadPayoffPDFFromAPI(calculationId, payoffDate);
  } catch (_error) {
    throw new Error("Failed to generate payoff statement PDF. Please try again.");
  }
}
