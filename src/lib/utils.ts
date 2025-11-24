import { type ClassValue, clsx } from "clsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { marked } from "marked";
import {
  GlobalWorkerOptions,
  getDocument,
  type PDFDocumentProxy,
} from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min?url";
import { twMerge } from "tailwind-merge";

GlobalWorkerOptions.workerSrc = pdfjsWorker;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateString(str: string, num: number) {
  return str.length > num ? `${str.slice(0, num)}...` : str;
}

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = getDocument({ data: arrayBuffer });
  const pdf: PDFDocumentProxy = await loadingTask.promise;

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    fullText += `${pageText}\n\n`;
  }

  return fullText.trim();
}

export async function downloadMarkdownAsPDF(
  markdown: string,
  filename: string = "document"
): Promise<void> {
  try {
    const html = marked(markdown);

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.left = "-99999px";
    iframe.style.top = "-99999px";
    iframe.style.width = "210mm";
    iframe.style.height = "297mm";
    iframe.style.border = "none";
    iframe.style.visibility = "hidden";
    iframe.style.opacity = "0";
    iframe.style.pointerEvents = "none";
    iframe.style.zIndex = "-9999";

    document.body.appendChild(iframe);

    await new Promise((resolve) => {
      iframe.onload = resolve;
      iframe.src = "about:blank";
    });

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      throw new Error("Failed to access iframe document");
    }

    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 20mm;
              font-family: Arial, sans-serif;
              font-size: 12pt;
              line-height: 1.6;
              color: #000000;
              background-color: white;
            }
            * { 
              color: #000000 !important; 
              background-color: transparent !important; 
            }
            h1 { font-size: 24pt; margin-top: 20px; margin-bottom: 10px; color: #000000; }
            h2 { font-size: 20pt; margin-top: 16px; margin-bottom: 8px; color: #000000; }
            h3 { font-size: 16pt; margin-top: 12px; margin-bottom: 6px; color: #000000; }
            h4 { font-size: 14pt; margin-top: 10px; margin-bottom: 5px; color: #000000; }
            h5 { font-size: 12pt; margin-top: 8px; margin-bottom: 4px; color: #000000; }
            h6 { font-size: 11pt; margin-top: 6px; margin-bottom: 3px; color: #000000; }
            p { margin-bottom: 10px; color: #000000; }
            code { background-color: #f4f4f4; padding: 2px 4px; border-radius: 3px; color: #000000; }
            pre { background-color: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; color: #000000; }
            blockquote { border-left: 4px solid #ddd; margin: 10px 0; padding-left: 10px; color: #666; }
            ul, ol { margin-bottom: 10px; padding-left: 20px; color: #000000; }
            li { color: #000000; }
            a { color: #0066cc; }
            table { 
              border-collapse: collapse; 
              width: 100%; 
              margin: 1rem 0; 
              color: #000000;
            }
            table th, table td { 
              border: 1px solid #000000; 
              padding: 8px; 
              color: #000000;
              background-color: transparent;
            }
            table th { 
              background-color: #f0f0f0; 
              font-weight: bold; 
              color: #000000;
            }
            table tr:nth-child(even) { 
              background-color: #f9f9f9; 
            }
            strong, b { color: #000000; }
            em, i { color: #000000; }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `);
    iframeDoc.close();

    await new Promise((resolve) => setTimeout(resolve, 200));

    const canvas = await html2canvas(iframeDoc.body, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      allowTaint: true,
      foreignObjectRendering: false,
    });

    if (iframe.parentNode) {
      document.body.removeChild(iframe);
    }

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}.pdf`);
  } catch {
    throw new Error("Failed to convert markdown to PDF");
  }
}

/**
 * Get the current date in the client's timezone formatted as YYYY-MM-DD
 * This ensures all calculations use the user's local date, not the server's
 */
export function getCurrentDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
