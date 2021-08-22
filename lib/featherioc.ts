export enum Scope {
  /**
   * Provides a new instance of the service
   * everytime it's resolved.
   */
  Transient,
  /**
   * Provides a single instance of the service
   * throughout the application.
   */
  Singleton,
}

export type ProvideOpts<T> = {
  /**
   * Class provider.
   */
  useClass?: new () => T;
  /**
   * Constant value provider.
   */
  useValue?: T;
  /**
   * Function provider.
   */
  useFunction?: () => T;
};

export type Token = string | symbol;

export class Registry extends Map<Token, RegistryEntry<unknown>> {}

export class NoSuchEntryError extends Error {
  /**
   * Thrown when a service could not be located in
   * the container using the specified token.
   *
   * @param token The service token in question.
   */
  constructor(public token: Token) {
    super(`Token '${token.toString()}' not found in registry.`);
  }
}

export class NoProviderError extends Error {
  /**
   * Thrown when attempting to resolve a service
   * without a given provider.
   *
   * @param service The service in question.
   */
  constructor(public service: RegistryEntry<unknown>) {
    super('No provider given for registry entry.');
  }
}

export class RegistryEntry<T> {
  private scope: Scope;

  private instance?: T;

  /**
   * A service that can be registered in a container.
   *
   * @param provide Options for the provider.
   */
  constructor(private provide: ProvideOpts<T>) {
    this.scope = Scope.Transient;
  }

  /**
   * Updates the scope for this service.
   *
   * @param scope The scope to use.
   */
  setScope(scope: Scope): this {
    this.scope = scope;

    if (this.scope === Scope.Singleton) {
      this.instance = this.getInstance();
    }

    return this;
  }

  /**
   * Returns the current scope.
   */
  getScope(): Scope {
    return this.scope;
  }

  /**
   * Gets an instance of the service.
   */
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

  /**
   * An IoC container.
   */
  constructor() {
    this.registry = new Registry();
  }

  /**
   * Binds a service.
   *
   * @param token The service token to use.
   * @param provide Options for the provider.
   */
  bind<T>(token: Token, provide: ProvideOpts<T>): RegistryEntry<T> {
    const entry = new RegistryEntry<T>(provide);
    this.registry.set(token, entry);
    return entry;
  }

  /**
   * Utility function for binding multiple services
   * at the same time.
   *
   * @param fn Callback function that provides the `bind` function.
   */
  bindMany(fn: (bind: this['bind']) => void): void {
    fn(this.bind.bind(this));
  }

  /**
   * Locates a dependency in the container using the
   * given token and resolves it.
   *
   * @param token The service token to use.
   */
  resolve<T>(token: Token): T {
    const entry = this.registry.get(token);
    if (!entry) {
      throw new NoSuchEntryError(token);
    }

    return entry.getInstance() as T;
  }

  /**
   * Returns a read-only copy of the container registry.
   */
  getRegistry(): Readonly<Registry> {
    return Object.freeze(this.registry);
  }

  /**
   * Clears the container registry.
   */
  clearRegistry(): void {
    this.registry.clear();
  }
}

/**
 * The IoC container instance you can use in
 * your application.
 */
export const container = new Container();
