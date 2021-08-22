export interface ILogger {
  log(msg: string): void;
}

export class Logger implements ILogger {
  log(msg: string): void {
    // eslint-disable-next-line no-console
    console.log(msg);
  }
}
