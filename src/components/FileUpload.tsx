import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

interface FileUploadProps {
  onUpload: (data: any[], headers: string[]) => void;
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const binaryStr = event.target?.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        
        // Extract headers from the first row
        const headers = Object.keys(data[0] || {});
        
        onUpload(data, headers);
      };

      reader.readAsBinaryString(file);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false
  });

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Step 1: Upload Excel/CSV File</h2>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-500'
          }`}
      >
        <input {...getInputProps()} />
        <ArrowUpTrayIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg mb-2">
          {isDragActive
            ? 'Drop the file here'
            : 'Drag and drop your Excel/CSV file here'}
        </p>
        <p className="text-sm text-gray-500">
          or click to select file
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Supported formats: .xlsx, .xls, .csv
        </p>
      </div>
    </div>
  );
} 