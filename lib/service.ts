import { MissingDependenciesError, NoProviderError } from './errors';
import type { Container } from './container';

export type Token = string | symbol;

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

export class Service<T = unknown> {
  private scope: Scope;

  private instance?: T;

  /**
   * A service that can be registered in a container.
   *
   * @param container The container this service belongs to.
   * @param provide Options for the provider.
   * @param token The service token used to register this service.
   */
  constructor(
    private container: Container,
    private provide: ProvideOpts<T>,
    public readonly token: Token,
  ) {
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
      const expectedCount = this.provide.useClass.length;
      const dependencies = tokens.map<Service>((token) =>
        this.container.resolve(token),
      );

      // Too few dependencies passed
      if (dependencies.length < expectedCount) {
        throw new MissingDependenciesError(
          this,
          dependencies.length,
          expectedCount,
        );
      }

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
