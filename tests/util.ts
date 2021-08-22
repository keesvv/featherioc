export interface ILogger {
  log(msg: string): string;
}

export class Logger implements ILogger {
  log(msg: string): string {
    return `[LOG] ${msg}`;
  }
}

export class TestService {
  constructor(private logger: ILogger) {}

  doSomething(): string {
    return this.logger.log('Something');
  }
}
