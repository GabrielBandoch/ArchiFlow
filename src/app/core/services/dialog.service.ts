import { Injectable, ViewContainerRef, ComponentRef, Type } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private viewContainerRef?: ViewContainerRef;

  registerContainerRef(ref: ViewContainerRef): void {
    this.viewContainerRef = ref;
  }

  open<T>(component: Type<T>, config?: { data?: any }): ComponentRef<T> {
    if (!this.viewContainerRef) {
      throw new Error('ViewContainerRef not registered. Call DialogService.registerContainerRef() first.');
    }

    const componentRef = this.viewContainerRef.createComponent(component);
    const instance = componentRef.instance as any;

    if (config?.data) {
      Object.assign(instance, config.data);
      if ('data' in instance) {
        instance.data = config.data;
      }
    }

    if ('show' in instance) {
      instance.show = true;
    }

    if ('close' in instance) {
      instance.close.subscribe(() => {
        componentRef.destroy();
      });
    }

    return componentRef;
  }
}
