import { container } from '../lib';

interface ILogger {
  log(msg: string): void;
}

class Logger implements ILogger {
  log(msg: string): void {
    console.log(msg);
  }
}

container.bind<ILogger>('Logger', { useClass: Logger });
