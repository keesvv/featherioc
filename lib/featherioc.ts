export enum Scope {
  Transient,
  Singleton,
}

export type ProvideOpts<T> = {
  useClass?: new () => T;
  useValue?: T;
  useFunction?: () => T;
};

export type Token = string | symbol;

export class Registry extends Map<Token, RegistryEntry<unknown>> {}

export class NoSuchEntryError extends Error {
  constructor(public token: Token) {
    super(`Token '${token.toString()}' not found in registry.`);
  }
}

export class NoProviderError extends Error {
  constructor(public entry: RegistryEntry<unknown>) {
    super('No provider given for registry entry.');
  }
}

export class RegistryEntry<T> {
  private scope: Scope;

  private instance?: T;

  constructor(private provide: ProvideOpts<T>) {
    this.scope = Scope.Transient;
  }

  setScope(scope: Scope): this {
    this.scope = scope;

    if (this.scope === Scope.Singleton) {
      this.instance = this.getInstance();
    }

    return this;
  }

  getScope(): Scope {
    return this.scope;
  }

  getInstance(): T {
    // TODO: refactor this method

    if (this.instance) return this.instance;

    if (this.provide.useClass) {
      return new this.provide.useClass();
    }

    if (this.provide.useValue) {
      return this.provide.useValue;
    }

    if (this.provide.useFunction) {
      return this.provide.useFunction();
    }

    throw new NoProviderError(this);
  }
}

export class Container {
  private readonly registry: Registry;

  constructor() {
    this.registry = new Registry();
  }

  bind<T>(token: Token, provide: ProvideOpts<T>): RegistryEntry<T> {
    const entry = new RegistryEntry<T>(provide);
    this.registry.set(token, entry);
    return entry;
  }

  bindMany(fn: (bind: this['bind']) => void): void {
    fn(this.bind.bind(this));
  }

  resolve<T>(token: Token): T {
    const entry = this.registry.get(token);
    if (!entry) {
      throw new NoSuchEntryError(token);
    }

    return entry.getInstance() as T;
  }

  getRegistry(): Readonly<Registry> {
    return Object.freeze(this.registry);
  }

  clearRegistry(): void {
    this.registry.clear();
  }
}

export const container = new Container();
