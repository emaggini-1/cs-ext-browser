import { EnvironmentInjector, Injectable, Injector } from '@angular/core';
import { AngularDelegate } from '@ionic/angular';
import { AngularFrameworkDelegate } from '@ionic/angular/common/providers/angular-delegate';
import { ComponentProps, ComponentRef } from '@ionic/core';

type AttachCallback = () => Promise<Element>;
type DetachCallback = (element: Element | null) => Promise<void>;

export class ComponentHandle {
  private component: Element | null = null;

  constructor(
    private attach: AttachCallback,
    private detach: DetachCallback,
  ) {}

  async mount(): Promise<Element> {
    return (this.component = await this.attach());
  }

  unmount(): Promise<void> {
    return this.detach(this.component ?? null);
  }
}

@Injectable({
  providedIn: 'root',
})
export class Renderer {
  private readonly framework: AngularFrameworkDelegate;

  constructor(
    private delegate: AngularDelegate,
    private environment: EnvironmentInjector,
    private injector: Injector,
  ) {
    this.framework = this.delegate.create(this.environment, this.injector);
  }

  private attach(host: Element, component: ComponentRef, properties?: ComponentProps, classes?: string[]): Promise<Element> {
    return this.framework.attachViewToDom(host, component, properties, classes);
  }

  private detach(host: Element, component: Element): Promise<void> {
    return this.framework.removeViewFromDom(host, component);
  }

  createHandle(
    host: Element,
    component: ComponentRef,
    properties?: ComponentProps,
    classes?: string[]
  ): ComponentHandle {
    return new ComponentHandle(
      (): Promise<Element> => this.attach(host, component, properties, classes),
      (element: Element | null): Promise<void> => {
        if (element) {
          return this.detach(host, element);
        } else {
          return Promise.resolve(); // Handle null case
        }
      }
    );
  }
}
