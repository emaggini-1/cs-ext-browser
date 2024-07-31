import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import {ApiService} from '../services/api.service';
import {ModalService} from "../services/modal.service";
import {firstValueFrom} from "rxjs";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonButton, IonHeader, IonToolbar, IonTitle, IonContent, HttpClientModule, CommonModule],
  providers: [ApiService],
})
export class HomePage {
  constructor(private api: ApiService, private modal: ModalService) { }
  async open(): Promise<void> {
    console.log('open');
    const myValue = (await firstValueFrom(this.modal.createLoad( () =>this.api.get())))[0];
    console.log('myValue', myValue);
    this.openExternalBrowser(`https://www.apnews.com/${myValue.id}`);
    console.log('open done');
  }

  openExternalBrowser(url: string): void {
    console.log('openExternalBrowser', url);
    window.open(url, '_system');
    console.log('openExternalBrowser done');
  }
}
