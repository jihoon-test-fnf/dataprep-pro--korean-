import React, { useState, useCallback } from 'react';
import { parseFile, generateDownloadData } from './services/fileService';
import { ColumnDef, DataRow, Step } from './types';
import FileUpload from './components/FileUpload';
import Sidebar from './components/Sidebar';
import DataPreview from './components/DataPreview';
import { Sparkles, ArrowLeft, Database, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>(Step.UPLOAD);
  const [columns, setColumns] = useState<ColumnDef[]>([]);
  const [data, setData] = useState<DataRow[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await parseFile(file);
      setColumns(result.columns);
      setData(result.rows);
      setFileName(result.fileName);
      setStep(Step.EDIT);
    } catch (err: any) {
      setError(err.message || '파일 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVisibility = useCallback((id: string) => {
    setColumns(prev => prev.map(col => 
      col.id === id ? { ...col, visible: !col.visible } : col
    ));
  }, []);

  const handleRename = useCallback((id: string, newName: string) => {
    setColumns(prev => prev.map(col => 
      col.id === id ? { ...col, currentHeader: newName } : col
    ));
  }, []);

  const handleDownload = (format: 'json' | 'csv') => {
    // Validation: Check for 'EMPTY' headers in visible columns
    const hasEmptyHeaders = columns.some(c => c.visible && c.currentHeader === 'EMPTY');
    
    if (hasEmptyHeaders) {
        const confirm = window.confirm("아직 이름이 'EMPTY'인 컬럼이 있습니다. 이대로 다운로드 하시겠습니까?");
        if(!confirm) return;
    }

    const dataUrl = generateDownloadData(columns, data, format);
    const link = document.createElement('a');
    link.href = dataUrl;
    
    // Create new filename
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    link.download = `${nameWithoutExt}_processed.${format}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setStep(Step.UPLOAD);
    setColumns([]);
    setData([]);
    setFileName('');
    setError(null);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="flex-none bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-blue-200 shadow-lg">
            <Sparkles size={18} />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
            DataPrep Pro
          </h1>
        </div>
        {step === Step.EDIT && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-md border border-slate-200">
                <Database size={14} className="text-slate-500"/>
                <span className="text-sm font-medium text-slate-600 max-w-[200px] truncate">{fileName}</span>
            </div>
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft size={16} /> 처음으로
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative flex">
        {step === Step.UPLOAD && (
          <div className="w-full flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-3">데이터를 쉽고 빠르게 전처리하세요</h2>
              <p className="text-slate-500 text-lg">엑셀, CSV 파일을 업로드하여 컬럼을 선택하고 형식을 변환할 수 있습니다.</p>
            </div>
            
            {error && (
               <div className="mb-6 px-4 py-3 bg-red-50 text-red-600 rounded-lg border border-red-200 flex items-center gap-2">
                 <span className="font-bold">오류:</span> {error}
               </div>
            )}

            {isLoading ? (
              <div className="flex flex-col items-center gap-4 p-12">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-slate-600 font-medium animate-pulse">데이터 분석 중...</p>
              </div>
            ) : (
              <FileUpload onFileUpload={handleFileUpload} />
            )}

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4"><CheckCircle2 size={20}/></div>
                    <h3 className="font-bold text-slate-800 mb-2">자동 컬럼 인식</h3>
                    <p className="text-sm text-slate-500">파일을 업로드하면 자동으로 헤더를 분석합니다. 비어있는 컬럼명도 감지합니다.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4"><CheckCircle2 size={20}/></div>
                    <h3 className="font-bold text-slate-800 mb-2">손쉬운 편집</h3>
                    <p className="text-sm text-slate-500">필요한 데이터만 선택하고, 직관적인 UI에서 컬럼명을 수정하세요.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4"><CheckCircle2 size={20}/></div>
                    <h3 className="font-bold text-slate-800 mb-2">다양한 포맷 지원</h3>
                    <p className="text-sm text-slate-500">전처리가 완료된 데이터를 CSV 또는 JSON 형식으로 즉시 다운로드하세요.</p>
                </div>
            </div>
          </div>
        )}

        {step === Step.EDIT && (
          <>
            {/* Sidebar - Mobile Responsive: hidden on very small screens, or stacked */}
            <div className="hidden md:flex flex-col h-full z-20">
              <Sidebar 
                columns={columns}
                onToggleVisibility={handleToggleVisibility}
                onRename={handleRename}
                onDownload={handleDownload}
              />
            </div>

            {/* Main Table Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <DataPreview columns={columns} data={data} />
            </div>

            {/* Mobile View Sidebar Placeholder (Simplified) */}
            <div className="md:hidden absolute inset-0 z-50 bg-white" style={{display: 'none'}}> 
                {/* In a real app, implement a drawer or toggle for mobile sidebar */}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;