export interface WebhookRequest {
  report_type: "company_doc" | "resume";
  file_content: string;
  company_id?: string;
  file_name?: string;
  employee_id?: string;
}

export interface WebhookResponse {
  success: boolean;
  data?: Array<{
    output: {
      cvf: number;
      chat: string;
      risks: number;
      schein: number;
      strengths: number;
      overall_score: number;
    };
  }>;
  error?: string;
}

export const callWebhook = async (
  file_content: string,
  company_id?: string,
  file_name?: string,
  employee_id?: string
): Promise<WebhookResponse> => {
  const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error("Webhook URL not configured");
  }

  let report_type: "company_doc" | "resume";
  if (company_id) {
    report_type = "company_doc";
  } else if (employee_id) {
    report_type = "resume";
  } else {
    throw new Error("Either company_id or employee_id must be provided");
  }

  const requestBody: WebhookRequest = {
    report_type,
    file_content,
    company_id,
    file_name,
    employee_id: employee_id || "",
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get response",
    };
  }
};

// PDF Download Functions

import store from "@/store";

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL as string;

/**
 * Get auth token from Redux store
 */
const getAuthToken = (): string | null => {
  try {
    // Get token directly from Redux store
    const state = store.getState();
    const token = state.global?.token;

    console.log(
      "Getting token from Redux store:",
      token ? "Token found" : "No token"
    );

    if (token) {
      return token;
    }

    console.error("No token found in Redux store");
  } catch (e) {
    console.error("Failed to get auth token:", e);
  }
  return null;
};

/**
 * Download transaction summary PDF from backend
 */
export const downloadTransactionsPDF = async (
  calculationId: string
): Promise<void> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/calc/${calculationId}/transactions-pdf`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to generate PDF: ${response.statusText}`);
    }

    // Get filename from Content-Disposition header
    const contentDisposition = response.headers.get("Content-Disposition");
    let filename = "Transaction_Summary.pdf";

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename=(.+)/);
      if (filenameMatch) {
        filename = filenameMatch[1].replace(/['"]/g, "");
      }
    }

    // Download the PDF
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading transaction PDF:", error);
    throw error;
  }
};

/**
 * Download payoff statement PDF from backend
 */
export const downloadPayoffStatementPDF = async (
  calculationId: string,
  payoffDate: string
): Promise<void> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/calc/payoff-statement-pdf`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          calculation_id: calculationId,
          payoff_date: payoffDate,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to generate PDF: ${response.statusText}`);
    }

    // Get filename from Content-Disposition header
    const contentDisposition = response.headers.get("Content-Disposition");
    let filename = "Payoff_Statement.pdf";

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename=(.+)/);
      if (filenameMatch) {
        filename = filenameMatch[1].replace(/['"]/g, "");
      }
    }

    // Download the PDF
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading payoff statement PDF:", error);
    throw error;
  }
};

/**
 * Download payoff demand letter DOCX from backend
 */
export const downloadPayoffDemandDocx = async (
  calculationId: string,
  payoffDate: string
): Promise<void> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/calc/payoff-demand-docx`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          calculation_id: calculationId,
          payoff_date: payoffDate,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to generate DOCX: ${response.statusText}`);
    }

    // Get filename from Content-Disposition header
    const contentDisposition = response.headers.get("Content-Disposition");
    let filename = "Payoff_Demand.docx";

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename=(.+)/);
      if (filenameMatch) {
        filename = filenameMatch[1].replace(/['"]/g, "");
      }
    }

    // Download the DOCX
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading payoff demand DOCX:", error);
    throw error;
  }
};
