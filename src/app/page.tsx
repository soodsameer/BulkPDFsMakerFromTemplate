'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import TemplateBuilder from '@/components/TemplateBuilder';
import PDFPreview from '@/components/PDFPreview';
import PDFDownload from '@/components/PDFDownload';

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [template, setTemplate] = useState<any>(null);
  const [generatedPDFs, setGeneratedPDFs] = useState<string[]>([]);

  const handleFileUpload = (data: any[], headers: string[]) => {
    setExcelData(data);
    setHeaders(headers);
    setCurrentStep(2);
  };

  const handleTemplateComplete = (template: any) => {
    setTemplate(template);
    setCurrentStep(3);
  };

  const handlePDFGeneration = (pdfUrls: string[]) => {
    setGeneratedPDFs(pdfUrls);
    setCurrentStep(4);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">PDF Template Maker</h1>
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center ${
                  step !== 4 ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {step}
                </div>
                {step !== 4 && (
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {currentStep === 1 && (
            <FileUpload onUpload={handleFileUpload} />
          )}
          {currentStep === 2 && (
            <TemplateBuilder
              headers={headers}
              onComplete={handleTemplateComplete}
            />
          )}
          {currentStep === 3 && (
            <PDFPreview
              template={template}
              data={excelData}
              onGenerate={handlePDFGeneration}
            />
          )}
          {currentStep === 4 && (
            <PDFDownload pdfs={generatedPDFs} />
          )}
        </div>
      </div>
    </main>
  );
}
