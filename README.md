# tinyioc
A tiny (~1.5 KB) Inversion-of-Control Container for JS/TS.

## About
**Why do we need yet _another_ IoC container library?**

For Node-powered apps, [InversifyJS](https://github.com/inversify/InversifyJS) and [TSyringe](https://github.com/microsoft/tsyringe) among other libraries often do the job well enough.
This library, however, fills the gap in the frontend development world. tinyioc does not rely on the [reflect-metadata](https://www.npmjs.com/package/reflect-metadata) polyfill and does not use decorators for service definitions.

**No decorators? How come?**

There are two reasons for this. The main reason for not having decorators is because that would otherwise break compatibility with ESBuild (see [this issue](https://github.com/evanw/esbuild/issues/257)) and thus, would break compatibility with Vite.

Another reason for not having decorators is because they tend to clutter the codebase quite fast; coworkers/others who have little to no experience with IoC may struggle with decorators such as `@injectable` in codebases they're working on because they don't know what it means. tinyioc leaves your classes as-is, which is a huge plus if you ask me.

**What's already supported?**

- Container registry
- Binding services
- Binding multiple services at the same time
- Scopes (Transient and Singleton)
- `useClass` provider for services
- `useValue` provider for services
- Resolving services by token

**What are you planning on supporting?**

- Constructor injection
- Property injection (not sure about this)
- More stuff I can't think of at the moment

## Usage
`// TODO:`

## Author
Kees van Voorthuizen

## License
[MIT](./LICENSE)
