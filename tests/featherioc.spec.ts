import {
  container,
  NoProviderError,
  NoSuchEntryError,
  Scope,
} from '../lib/featherioc';

interface ILogger {
  log(msg: string): void;
}

class Logger implements ILogger {
  log(msg: string): void {
    // eslint-disable-next-line no-console
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

test('bind interface to concrete class in singleton scope', () => {
  container
    .bind<ILogger>('Logger', { useClass: Logger })
    .setScope(Scope.Singleton);

  expect(container.getRegistry().get('Logger').getScope()).toBe(
    Scope.Singleton,
  );
});

test('bind multiple at the same time', () => {
  container.bindMany((bind) => {
    bind('Key1', { useValue: 'Val1' });
    bind('Key2', { useValue: 'Val2' });
  });

  expect(Array.from(container.getRegistry().keys())).toEqual(
    expect.arrayContaining(['Key1', 'Key2']),
  );
});

test('resolve a dependency', () => {
  container.bind<ILogger>('Logger', { useClass: Logger });
  expect(container.resolve<ILogger>('Logger')).toBeInstanceOf(Logger);
});

test('resolve a singleton dependency', () => {
  container
    .bind<ILogger>('Logger', { useClass: Logger })
    .setScope(Scope.Singleton);

  expect(container.resolve<ILogger>('Logger')).toBeInstanceOf(Logger);
});

test('resolve a dependency with a constant value', () => {
  container.bind<string>('TestString', { useValue: 'Test string' });

  expect(container.resolve<string>('TestString')).toBe('Test string');
});

test('resolve a non-existent dependency', () => {
  expect(() => container.resolve('Something')).toThrow(NoSuchEntryError);
});

test('resolve a dependency without a provider', () => {
  container.bind<ILogger>('Logger', {});
  expect(() => container.resolve('Logger')).toThrow(NoProviderError);
});
