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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useClass?: new (...args: any[]) => T;
  /**
   * Constant value provider.
   */
  useValue?: T;
  /**
   * Function provider.
   */
  useFunction?: () => T;
  /**
   * The dependencies to inject in the service.
   */
  dependencies?: Token[];
};

export type Token = string | symbol;

export class Registry extends Map<Token, Service> {}

export class NoSuchServiceError extends Error {
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
  constructor(public service: Service) {
    super('No provider given for this service.');
  }
}

export class Service<T = unknown> {
  private scope: Scope;

  private instance?: T;

  /**
   * A service that can be registered in a container.
   *
   * @param container The container this service belongs to.
   * @param provide Options for the provider.
   */
  constructor(private container: Container, private provide: ProvideOpts<T>) {
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
      const tokens = this.provide.dependencies || [];
      const dependencies = tokens.map<Service>((token) =>
        this.container.resolve(token),
      );

      return new this.provide.useClass(...dependencies);
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
  bind<T>(token: Token, provide: ProvideOpts<T>): Service<T> {
    const service = new Service<T>(this, provide);
    this.registry.set(token, service);
    return service;
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
   * Locates a service in the container using the
   * given token and resolves it.
   *
   * @param token The service token to use.
   */
  resolve<T>(token: Token): T {
    const service = this.registry.get(token);
    if (!service) {
      throw new NoSuchServiceError(token);
    }

    return service.getInstance() as T;
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
