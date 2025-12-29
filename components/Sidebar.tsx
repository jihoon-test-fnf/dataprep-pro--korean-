import React from 'react';
import { ColumnDef } from '../types';
import { Eye, EyeOff, Edit2, AlertCircle } from 'lucide-react';

interface SidebarProps {
  columns: ColumnDef[];
  onToggleVisibility: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onDownload: (format: 'json' | 'csv') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ columns, onToggleVisibility, onRename, onDownload }) => {
  const visibleCount = columns.filter(c => c.visible).length;

  return (
    <div className="w-full md:w-96 bg-white border-r border-slate-200 flex flex-col h-full shadow-xl z-20">
      <div className="p-6 border-b border-slate-100 bg-slate-50">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          컬럼 관리
          <span className="text-xs font-normal bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            {visibleCount} / {columns.length}
          </span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          출력할 컬럼을 선택하고 이름을 수정하세요.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {columns.map((col) => (
          <div
            key={col.id}
            className={`group p-3 rounded-lg border transition-all duration-200 ${
              col.visible ? 'border-blue-200 bg-blue-50/30' : 'border-slate-100 bg-slate-50 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => onToggleVisibility(col.id)}
                className={`p-1.5 rounded-md transition-colors ${
                  col.visible 
                    ? 'text-blue-600 bg-blue-100 hover:bg-blue-200' 
                    : 'text-slate-400 bg-slate-200 hover:bg-slate-300'
                }`}
                title={col.visible ? "숨기기" : "보이기"}
              >
                {col.visible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-400 truncate">원본:</span>
                    <span className="text-xs text-slate-500 truncate" title={col.originalHeader}>
                        {col.originalHeader.startsWith('EMPTY_') ? '(공백)' : col.originalHeader}
                    </span>
                </div>
              </div>
            </div>

            <div className="relative">
                {col.currentHeader === 'EMPTY' && col.visible && (
                     <div className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-500 animate-pulse" title="이름을 입력해주세요">
                        <AlertCircle size={16} />
                     </div>
                )}
              <input
                type="text"
                value={col.currentHeader}
                onChange={(e) => onRename(col.id, e.target.value)}
                disabled={!col.visible}
                placeholder="컬럼명 입력"
                className={`w-full text-sm px-3 py-2 rounded border focus:outline-none focus:ring-2 transition-all ${
                    col.currentHeader === 'EMPTY' 
                        ? 'border-amber-300 focus:border-amber-500 focus:ring-amber-200 bg-amber-50' 
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100 bg-white'
                }`}
              />
              <Edit2 className="absolute right-3 top-2.5 text-slate-300 pointer-events-none" size={14}/>
            </div>
            
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-slate-200 bg-white space-y-3">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">내보내기</h3>
        <div className="grid grid-cols-2 gap-3">
            <button
            onClick={() => onDownload('csv')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700 rounded-lg font-medium transition-colors"
            >
            CSV 저장
            </button>
            <button
            onClick={() => onDownload('json')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md shadow-blue-200 transition-colors"
            >
            JSON 저장
            </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;