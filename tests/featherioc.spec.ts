import { ILogger, Logger, TestService } from './util';
import {
  container,
  NoProviderError,
  NoSuchServiceError,
  Scope,
} from '../lib/featherioc';

beforeEach(() => {
  container.clearRegistry();
});

test('bind service to class', () => {
  container.bind<ILogger>('Logger', { useClass: Logger });
  expect(container.getRegistry().has('Logger')).toBe(true);
});

test('bind service to class in singleton scope', () => {
  container
    .bind<ILogger>('Logger', { useClass: Logger })
    .setScope(Scope.Singleton);

  expect(container.getRegistry().get('Logger').getScope()).toBe(
    Scope.Singleton,
  );
});

test('bind service with symbol as token', () => {
  const testSymbol = Symbol.for('test');
  container.bind<string>(testSymbol, { useValue: 'Test!' });
  expect(container.resolve<string>(testSymbol)).toBe('Test!');
});

test('bind multiple services at the same time', () => {
  container.bindMany((bind) => {
    bind('Key1', { useValue: 'Val1' });
    bind('Key2', { useValue: 'Val2' });
  });

  expect(Array.from(container.getRegistry().keys())).toEqual(
    expect.arrayContaining(['Key1', 'Key2']),
  );
});

test('resolve a service', () => {
  container.bind<ILogger>('Logger', { useClass: Logger });
  expect(container.resolve<ILogger>('Logger')).toBeInstanceOf(Logger);
});

test('resolve a singleton service', () => {
  container
    .bind<ILogger>('Logger', { useClass: Logger })
    .setScope(Scope.Singleton);

  expect(container.resolve<ILogger>('Logger')).toBeInstanceOf(Logger);
});

test('resolve a service with a dependency', () => {
  container.bind<ILogger>('Logger', { useClass: Logger });
  container.bind<TestService>('TestService', {
    useClass: TestService,
    dependencies: ['Logger'],
  });

  expect(container.resolve<TestService>('TestService').doSomething()).toBe(
    '[LOG] Something',
  );
});

test('resolve a service with a value provider', () => {
  container.bind<string>('TestString', { useValue: 'Test string' });

  expect(container.resolve<string>('TestString')).toBe('Test string');
});

test('resolve a service with a function provider', () => {
  container.bind<string>('Version', {
    useFunction: () => process.version,
  });

  expect(container.resolve<string>('Version')).toBe(process.version);
});

test('resolve a service without a provider', () => {
  container.bind<ILogger>('Logger', {});
  expect(() => container.resolve('Logger')).toThrow(NoProviderError);
});

test('resolve a non-existent service', () => {
  expect(() => container.resolve('Something')).toThrow(NoSuchServiceError);
});
