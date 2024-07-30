import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-loading-content',
  templateUrl: './loading-content.component.html',
  styleUrls: ['./loading-content.component.scss'],
})
export class LoadingContentComponent implements OnInit, OnDestroy {
  private readonly content = [
    'Loading...',
    'Retrieving information...',
    'Verifying information...',
    'Almost done...',
    'One more moment...',
    'Finishing up... Thanks for your patience.',
  ];

  private readonly period = 3 * 1000;
  private index = 0;
  private interval?: Subscription;

  get message(): string {
    return this.content[this.clamp(this.index, 0, this.content.length - 1)];
  }

  ngOnInit(): void {
    this.interval = interval(this.period).subscribe((i) => (this.index = i + 1));
  }

  ngOnDestroy(): void {
    this.interval?.unsubscribe();
  }

  clamp(value: number, min = -Infinity, max = Infinity): number {
    return Math.min(Math.max(value, min), max);
  }
}
