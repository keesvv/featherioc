import { NoSuchServiceError } from './errors';
import { Service, ProvideOpts, Token } from './service';

export class Registry extends Map<Token, Service> {}

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
    const service = new Service<T>(this, provide, token);
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
