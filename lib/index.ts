export enum IocLifetime {
  Transient,
  Singleton,
}

export type IocProvide<T> = {
  useClass?: new () => T;
  useValue?: T;
};

export type IocToken = string;

export class IocRegistry extends Map<IocToken, IocRegistryEntry<any>> {}

export class IocRegistryEntry<T> {
  private lifetime: IocLifetime;
  private instance?: T;

  constructor(private provide: IocProvide<T>) {
    this.lifetime = IocLifetime.Transient;
  }

  setLifetime(lifetime: IocLifetime): this {
    this.lifetime = lifetime;

    if (this.lifetime === IocLifetime.Singleton) {
      this.instance = this.getInstance();
    }

    return this;
  }

  getInstance(): T {
    if (this.instance) return this.instance;

    if (this.provide.useClass) {
      return new this.provide.useClass();
    } else if (this.provide.useValue) {
      return this.provide.useValue;
    }

    throw new Error('No provider given for registry entry.');
  }
}

export class IocContainer {
  private readonly registry: IocRegistry;

  constructor() {
    this.registry = new IocRegistry();
  }

  bind<T>(token: IocToken, provide: IocProvide<T>): IocRegistryEntry<T> {
    const entry = new IocRegistryEntry<T>(provide);
    this.registry.set(token, entry);
    return entry;
  }

  bindMany(fn: (bind: this['bind']) => void): void {
    fn(this.bind.bind(this));
  }

  resolve<T>(token: IocToken): T {
    const entry = this.registry.get(token);
    if (!entry) {
      throw new Error('Token not found in registry.');
    }

    return entry.getInstance() as T;
  }

  getRegistry(): Readonly<IocRegistry> {
    return Object.freeze(this.registry);
  }
}

export const container = new IocContainer();
