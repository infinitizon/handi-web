import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-container',
  templateUrl: './profile-container.component.html',
  styleUrls: ['./profile-container.component.scss']
})
export class ProfileContainerComponent implements OnInit {
  tab = 'info';
  constructor() { }

  ngOnInit() {
  }

}
