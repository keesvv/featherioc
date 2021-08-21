import { container } from '../lib';

interface ILogger {
  log(msg: string): void;
}

class Logger implements ILogger {
  log(msg: string): void {
    console.log(msg);
  }
}

beforeEach(() => {
  container.clearRegistry();
});

test('bind interface to concrete class', () => {
  container.bind<ILogger>('Logger', { useClass: Logger });
  expect(container.getRegistry().has('Logger')).toBe(true);
});