import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface PDFDownloadProps {
  pdfs: string[];
}

export default function PDFDownload({ pdfs }: PDFDownloadProps) {
  const downloadAll = () => {
    pdfs.forEach((pdf, index) => {
      const link = document.createElement('a');
      link.href = pdf;
      link.download = `document-${index + 1}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const downloadSingle = (pdfUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `document-${index + 1}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Step 4: Download PDFs</h2>

      <div className="border rounded-lg p-4">
        <div className="mb-4">
          <button
            onClick={downloadAll}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Download All PDFs ({pdfs.length})
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium mb-2">Individual Downloads</h3>
          {pdfs.map((pdf, index) => (
            <button
              key={index}
              onClick={() => downloadSingle(pdf, index)}
              className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg"
            >
              <span>Document {index + 1}</span>
              <ArrowDownTrayIcon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 