import { Component, OnInit } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'ngx-lottie/lib/symbols';

@Component({
  selector: 'app-empty-data',
  templateUrl: './empty-data.component.html',
  styleUrls: ['./empty-data.component.css'],
})
export class EmptyDataComponent implements OnInit {
  options: AnimationOptions = {
    path: 'https://assets2.lottiefiles.com/packages/lf20_olbyptqd.json',
  };

  constructor() {}

  ngOnInit() {}

  animationCreated(animationItem: AnimationItem): void {
    // console.log(animationItem);
  }
}
