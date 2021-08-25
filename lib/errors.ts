import type { Token } from '.';
import type { Service } from './service';

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
    super(`No provider given for service '${service.token.toString()}'.`);
  }
}

export class MissingDependenciesError extends Error {
  /**
   * Thrown when a service has missing dependencies.
   *
   * @param service The service in question.
   * @param passedCount The amount of passed dependencies.
   * @param expectedCount The amount of expected dependencies.
   */
  constructor(
    public service: Service,
    public passedCount: number,
    public expectedCount: number,
  ) {
    super(
      `Service '${service.token.toString()}' has missing dependencies (got ${passedCount}, expected ${expectedCount}).`,
    );
  }
}
