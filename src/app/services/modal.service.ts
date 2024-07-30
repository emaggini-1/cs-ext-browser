import { Injectable } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { LoadingOptions } from '@ionic/core';
import { asyncScheduler, defer, Observable, ObservableInput, of, scheduled, throwError, zip } from 'rxjs';
import { catchError, finalize, mergeMap } from 'rxjs/operators';
import { Renderer } from './renderer.service';
import { LoadingContentComponent } from '../shared/loading-content/loading-content.component';

type LoadingCallback<T> = () => Observable<T>;

class CallbackError {
  constructor(public error: Error) {}
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(
    private alert: AlertController,
    private loading: LoadingController,
    private navigation: NavController,
    private renderer: Renderer,
  ) {}

  createLoad<T>(callback: LoadingCallback<T>, options?: LoadingOptions): Observable<T> {
    console.log('createLoad');

    const defaultOptions = {
      message: 'Loading...',
    };

    const createModal = (): ObservableInput<HTMLIonLoadingElement> => {
      return this.loading
        .create({ ...defaultOptions, ...(options ?? {}) })
        .then((modal) => onRenderComponent(modal))
        .then((modal) => modal.present().then(() => modal));
    };

    const onCatch = (error: Error): ObservableInput<CallbackError> => {
      return of(new CallbackError(error));
    };

    const onRenderComponent = async (modal: HTMLIonLoadingElement): Promise<HTMLIonLoadingElement> => {
      console.log('onRenderComponent');

      const host = modal.querySelector('.loading-content');

      if (!host) {
        throw new Error('Host element not found');
      }

      // Remove all children from the host
      while (host.firstChild) {
        host.firstChild.remove();
      }

      // Mount the component onto the host
      const handle = this.renderer.createHandle(host, LoadingContentComponent);
      await handle.mount();

      // Unmount when the modal is dismissed
      void modal.onDidDismiss().then(() => {
        console.log('onDidDismiss start');
        handle.unmount();
        console.log('onDidDismiss end');
      });
      return modal;
    };

    const onSubscribe = (): ObservableInput<[HTMLIonLoadingElement, CallbackError | T]> => {
      console.log('onSubscribe');
      return zip(scheduled(createModal(), asyncScheduler), callback().pipe(catchError(onCatch)));
    };

    const onComplete = ([modal, result]: [HTMLIonLoadingElement, CallbackError | T]): ObservableInput<T> => {
      console.log('onComplete');
      const next = result instanceof CallbackError ? throwError(() => result.error) : of(result as T);
      return next.pipe(finalize(() => modal.dismiss()));
    };

    console.log('returning defer');
    return defer(onSubscribe).pipe(mergeMap(onComplete));
  }
}
