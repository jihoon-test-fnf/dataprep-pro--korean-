export interface ColumnDef {
  id: string;
  originalHeader: string;
  currentHeader: string;
  visible: boolean;
  isEmptyOriginal: boolean;
}

export type DataRow = Record<string, any>;

export interface ProcessedData {
  columns: ColumnDef[];
  rows: DataRow[];
  fileName: string;
}

export enum Step {
  UPLOAD = 'UPLOAD',
  EDIT = 'EDIT',
  EXPORT = 'EXPORT' // Optional, mostly handled within EDIT
}