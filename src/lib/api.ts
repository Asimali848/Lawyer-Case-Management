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
  employee_id?: string,
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
