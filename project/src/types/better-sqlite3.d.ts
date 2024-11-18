declare module 'better-sqlite3' {
  interface Database {
    prepare(sql: string): Statement;
    transaction<T>(fn: () => T): T;
    pragma(pragma: string, options?: { simple?: boolean }): any;
    checkpoint(databaseName?: string): void;
    backup(destination: string, options?: { progress: () => void }): Promise<void>;
    exec(sql: string): void;
    close(): void;
    loadExtension(path: string): void;
  }

  interface Statement {
    run(...params: any[]): RunResult;
    get(...params: any[]): any;
    all(...params: any[]): any[];
    iterate(...params: any[]): IterableIterator<any>;
    bind(...params: any[]): Statement;
    columns(): ColumnDefinition[];
    raw(raw?: boolean): Statement;
  }

  interface RunResult {
    changes: number;
    lastInsertRowid: number | bigint;
  }

  interface ColumnDefinition {
    name: string;
    column: string | null;
    table: string | null;
    database: string | null;
    type: string | null;
  }

  interface Options {
    readonly?: boolean;
    fileMustExist?: boolean;
    timeout?: number;
    verbose?: Function;
  }

  function BetterSqlite3(filename: string, options?: Options): Database;
  export = BetterSqlite3;
}