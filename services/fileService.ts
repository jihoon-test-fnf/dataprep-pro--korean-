import * as XLSX from 'xlsx';
import { ColumnDef, DataRow, ProcessedData } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Parses an uploaded file (CSV or XLSX) and extracts columns and data.
 * Handles empty headers by marking them.
 */
export const parseFile = async (file: File): Promise<ProcessedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Assume first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Parse to JSON array of arrays (header: 1) to inspect headers manually first
        const jsonSheet = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1, defval: '' });

        if (!jsonSheet || jsonSheet.length === 0) {
          reject(new Error("파일에 데이터가 없습니다."));
          return;
        }

        const headers = jsonSheet[0];
        const rawRows = jsonSheet.slice(1);

        // Process Columns
        const columns: ColumnDef[] = headers.map((h, index) => {
          const originalHeader = h ? String(h).trim() : '';
          const isEmpty = originalHeader === '';
          
          return {
            id: uuidv4(),
            originalHeader: isEmpty ? `EMPTY_${index}` : originalHeader, // Internal ID for tracking
            currentHeader: isEmpty ? 'EMPTY' : originalHeader, // Display name
            visible: true,
            isEmptyOriginal: isEmpty
          };
        });

        // Map rows to object structure using index to match columns
        // We use index-based mapping because keys might be duplicate or empty in raw data
        const rows: DataRow[] = rawRows.map((row) => {
          const rowObj: DataRow = {};
          columns.forEach((col, index) => {
            // Assign value using the internal ID as key initially to avoid collision
            // or just store raw data array? 
            // Better: Store keyed by Column ID to be safe against renaming collisions during edit
            rowObj[col.id] = row[index]; 
          });
          return rowObj;
        });

        resolve({
          columns,
          rows,
          fileName: file.name
        });

      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

/**
 * Generates the final output for download
 */
export const generateDownloadData = (columns: ColumnDef[], rows: DataRow[], format: 'csv' | 'json') => {
  // Filter visible columns
  const visibleColumns = columns.filter(c => c.visible);

  // Remap rows to use the 'currentHeader' as keys
  const exportData = rows.map(row => {
    const newRow: Record<string, any> = {};
    visibleColumns.forEach(col => {
      newRow[col.currentHeader] = row[col.id];
    });
    return newRow;
  });

  if (format === 'json') {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    return dataStr;
  } else {
    // CSV
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
    const dataStr = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(csvOutput); // Add BOM for Excel Korean support
    return dataStr;
  }
};