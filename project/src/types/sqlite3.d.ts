declare module 'sqlite3' {
  export interface Database {
    run(sql: string, params?: any[], callback?: (err: Error | null) => void): this;
    run(sql: string, callback?: (err: Error | null) => void): this;
    get(sql: string, params?: any[], callback?: (err: Error | null, row: any) => void): this;
    get(sql: string, callback?: (err: Error | null, row: any) => void): this;
    all(sql: string, params?: any[], callback?: (err: Error | null, rows: any[]) => void): this;
    all(sql: string, callback?: (err: Error | null, rows: any[]) => void): this;
    serialize(callback?: () => void): void;
    parallelize(callback?: () => void): void;
    close(callback?: (err: Error | null) => void): void;
  }

  export interface Statement {
    run(params?: any[], callback?: (err: Error | null) => void): this;
    run(callback?: (err: Error | null) => void): this;
    get(params?: any[], callback?: (err: Error | null, row: any) => void): this;
    get(callback?: (err: Error | null, row: any) => void): this;
    all(params?: any[], callback?: (err: Error | null, rows: any[]) => void): this;
    all(callback?: (err: Error | null, rows: any[]) => void): this;
    finalize(callback?: (err: Error | null) => void): void;
  }

  export function verbose(): any;

  export const OPEN_READWRITE: number;
  export const OPEN_CREATE: number;
  export const OPEN_READONLY: number;
}