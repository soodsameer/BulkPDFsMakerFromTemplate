import { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import { DocumentIcon } from '@heroicons/react/24/outline';

interface PDFPreviewProps {
  template: any;
  data: any[];
  onGenerate: (pdfUrls: string[]) => void;
}

export default function PDFPreview({
  template,
  data,
  onGenerate,
}: PDFPreviewProps) {
  const [generating, setGenerating] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const generatePDFs = async () => {
    setGenerating(true);
    const pdfs: string[] = [];

    try {
      // Generate a PDF for each row of data
      for (const row of data) {
        const doc = new jsPDF({
          format: 'a4',
          unit: 'pt',
          orientation: template.orientation,
        });

        // Place each element from the template
        template.elements.forEach((element: any) => {
          const { content, style, type } = element;
          // Convert any value to string to prevent jsPDF errors
          const text = String(type === 'field' ? (row[content] ?? '') : content);

          doc.setFontSize(style.fontSize);
          doc.setFont('helvetica', style.fontWeight === 'bold' ? 'bold' : 'normal');
          doc.text(text, style.x, style.y);
        });

        // Convert to data URL
        const pdfUrl = doc.output('dataurlstring');
        pdfs.push(pdfUrl);

        // Set the first PDF as preview
        if (pdfs.length === 1) {
          setPreview(pdfUrl);
        }
      }

      onGenerate(pdfs);
    } catch (error) {
      console.error('Error generating PDFs:', error);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    generatePDFs();
  }, [template, data]);

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Step 3: Preview PDFs</h2>

      <div className="border rounded-lg p-4">
        {generating ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Generating PDFs...</p>
          </div>
        ) : preview ? (
          <div>
            <div className="mb-4">
              <h3 className="font-medium mb-2">Preview (First PDF)</h3>
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  src={preview}
                  className="w-full h-[842px]"
                  title="PDF Preview"
                />
              </div>
            </div>
            <div className="text-center text-sm text-gray-500">
              {data.length} PDFs generated successfully
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <DocumentIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p>No preview available</p>
          </div>
        )}
      </div>
    </div>
  );
} 