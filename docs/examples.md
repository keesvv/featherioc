# Examples

## Defining services
```ts
import { container, Scope } from 'featherioc';

// Just regular classes and interfaces, nothing special
// to see here

export interface ILogger {
  log(msg: string): void;
}

export interface ITestService {
  doSomething(): void;
}

export class Logger implements ILogger {
  log(msg: string): void {
    console.log(msg);
  }
}

export class TestService implements ITestService {
  // Dependencies are passed through constructors
  constructor(private logger: ILogger) {}

  doSomething(): void {
    this.logger.log('Hello, world!');
  }
}
```

## Binding services
```ts
// Provide a concrete class
container.bind<ILogger>('Logger', { useClass: Logger });

// Provide a concrete class in singleton scope
container
  .bind<ILogger>('Logger', { useClass: Logger })
  .setScope(Scope.Singleton);

// Provide a concrete class with dependencies
container.bind<ITestService>('TestService', {
  useClass: TestService,
  dependencies: ['Logger'] // Array of `Token`s
});

// Provide a constant value
container.bind<string>('MyString', { useValue: 'A string value!' });

// Provide a function
container.bind<number>('CurrentHour', { useFunction: () => new Date().getHours() });
```

## Manually resolving services
> This should not be the preferred method. Regularly using the resolver indicates
> the use of the _service locator pattern_, which is frequently seen as an
> [antipattern](https://blog.ploeh.dk/2010/02/03/ServiceLocatorisanAnti-Pattern)
> as it hides the dependencies of a service. Instead, bind services with dependencies.

```ts
const logger = container.resolve<ILogger>('Logger');

logger.log('Hello, world!');
```
