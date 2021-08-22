# featherioc
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/keesvv/featherioc/CI?style=flat-square)
![Codecov](https://img.shields.io/codecov/c/github/keesvv/featherioc?style=flat-square)
![npm bundle size](https://img.shields.io/bundlephobia/min/featherioc?style=flat-square)

A tiny (~1.5 KB) Inversion-of-Control Container for JS/TS.

## About
**Why do we need yet _another_ IoC container library?**

For Node-powered apps, [InversifyJS](https://github.com/inversify/InversifyJS) and [TSyringe](https://github.com/microsoft/tsyringe) among other libraries often do the job well enough.
This library, however, fills the gap in the frontend development world. featherioc does not rely on the [reflect-metadata](https://www.npmjs.com/package/reflect-metadata) polyfill and does not use decorators for service definitions.

**No decorators? How come?**

There are two reasons for this. The main reason for not having decorators is because that would otherwise break compatibility with ESBuild (see [this issue](https://github.com/evanw/esbuild/issues/257)) and thus, would break compatibility with Vite.

Another reason for not having decorators is because they tend to clutter the codebase quite fast; coworkers/others who have little to no experience with IoC may struggle with decorators such as `@injectable` in codebases they're working on because they don't know what it means. featherioc leaves your classes as-is, which is a huge plus if you ask me.

**What's already supported?**

- [x] Container registry
- [x] Binding services
- [x] Binding multiple services at the same time
- [x] Scopes (Transient and Singleton)
- [x] `useClass` provider for services
- [x] `useValue` provider for services
- [x] `useFunction` provider for services
- [x] Resolving services by token
- [x] Use `Symbol`s as tokens
- [x] Constructor injection

**What are you planning on supporting?**

- [ ] More stuff I can't think of at the moment

**What are you \*not\* planning on supporting?**

- Property injection
- Decorators

## Example
```ts
import { container } from 'featherioc';

export interface ILogger {
  log(msg: string): void;
}

export class Logger implements ILogger {
  log(msg: string): void {
    console.log(msg);
  }
}

// Binding a service
container.bind<ILogger>('Logger', { useClass: Logger });

// Resolving a service
const logger = container.resolve<ILogger>('Logger');
logger.log('Hello, world!');
```

> I will further extend this section soon.

## Author
Kees van Voorthuizen

## License
[MIT](./LICENSE)
