import { createPayoffStatementData, generatePayoffStatementPDF } from "./pdf-generator";

/**
 * Downloads a payoff statement PDF
 */
export async function downloadPayoffStatementPDF(
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
  principalBalance: string | number,
  accruedInterest: string | number,
): Promise<void> {
  try {
    const principalBalanceNum =
      typeof principalBalance === "string" ? parseFloat(principalBalance) || 0 : principalBalance;

    const accruedInterestNum = typeof accruedInterest === "string" ? parseFloat(accruedInterest) || 0 : accruedInterest;

    const payoffData = createPayoffStatementData(caseData, payoffDate, principalBalanceNum, accruedInterestNum);

    await generatePayoffStatementPDF(payoffData);
  } catch (_error) {
    throw new Error("Failed to generate payoff statement PDF. Please try again.");
  }
}
