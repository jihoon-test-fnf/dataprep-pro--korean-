import React, { useCallback } from 'react';
import { Upload, FileSpreadsheet, FileType } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        onFileUpload(files[0]);
      }
    },
    [onFileUpload]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="w-full max-w-2xl mx-auto mt-12"
    >
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center w-full h-80 border-2 border-slate-300 border-dashed rounded-3xl cursor-pointer bg-white hover:bg-slate-50 hover:border-blue-500 transition-all duration-300 group shadow-lg"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          <div className="mb-6 p-4 bg-blue-50 rounded-full group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-10 h-10 text-blue-600" />
          </div>
          <p className="mb-2 text-xl font-semibold text-slate-700">
            여기로 파일을 드래그하거나 클릭하세요
          </p>
          <p className="text-sm text-slate-500 mb-6">
            지원 형식: .xlsx, .csv (대용량 파일도 빠르게 처리됩니다)
          </p>
          
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1"><FileSpreadsheet size={14}/> Excel</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="flex items-center gap-1"><FileType size={14}/> CSV</span>
          </div>
        </div>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          onChange={handleChange}
        />
      </label>
    </div>
  );
};

export default FileUpload;