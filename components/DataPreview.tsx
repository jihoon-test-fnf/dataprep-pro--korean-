import React from 'react';
import { ColumnDef, DataRow } from '../types';

interface DataPreviewProps {
  columns: ColumnDef[];
  data: DataRow[];
}

const DataPreview: React.FC<DataPreviewProps> = ({ columns, data }) => {
  // Only show visible columns
  const visibleColumns = columns.filter((col) => col.visible);

  // Limit preview rows for performance
  const previewData = data.slice(0, 100);

  if (visibleColumns.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center h-full bg-slate-50 text-slate-400">
        <p>선택된 컬럼이 없습니다. 사이드바에서 컬럼을 선택해주세요.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-50 relative">
      <div className="min-w-full inline-block align-middle">
        <div className="border-b border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-white sticky top-0 z-10 shadow-sm">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider sticky left-0 bg-white border-r border-slate-100 w-16">
                    #
                </th>
                {visibleColumns.map((col) => (
                    <th
                    key={col.id}
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap border-r border-slate-100 min-w-[150px] ${
                        col.currentHeader === 'EMPTY' ? 'text-amber-600 bg-amber-50' : 'text-slate-700'
                    }`}
                    >
                    {col.currentHeader}
                    </th>
                ))}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
                {previewData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400 sticky left-0 bg-white border-r border-slate-100 font-mono">
                    {rowIndex + 1}
                    </td>
                    {visibleColumns.map((col) => (
                    <td
                        key={`${rowIndex}-${col.id}`}
                        className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 border-r border-slate-100/50 max-w-xs overflow-hidden text-ellipsis"
                        title={String(row[col.id] || '')}
                    >
                        {row[col.id] !== undefined ? String(row[col.id]) : ''}
                    </td>
                    ))}
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        {data.length > 100 && (
            <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 border-t border-slate-200">
                미리보기는 최대 100개의 행만 표시됩니다. 전체 데이터({data.length}행)는 다운로드 시 포함됩니다.
            </div>
        )}
      </div>
    </div>
  );
};

export default DataPreview;