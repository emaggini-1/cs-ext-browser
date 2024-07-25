import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonButton, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {
  constructor() { }
  open() {
    this.openExternalBrowser('https://www-dev.mybranchdev.org/itemId/8057884a-e170-477a-9f35-3671e6bf73a4?accessCode=989e0181-1b1d-41b2-9cf4-8fa9aad5a8cc');
  }

  openExternalBrowser(url: string): void {
    console.log('openExternalBrowser', url);
    window.open(url, '_system');
    console.log('openExternalBrowser done');
  }
}
