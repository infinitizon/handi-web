import { Component, OnInit } from '@angular/core';
import { ApplicationContextService } from '@app/shared/services/application-context.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
})
export class SecurityComponent implements OnInit {
  enableN: boolean = false;
  container: any = {};
  userInformation!: any;
  constructor(public appContext: ApplicationContextService) {}

  ngOnInit() {
    this.appContext.getUserInformation().subscribe({
      next: (data: any) => {
        this.userInformation = data;
      },
    });
  }

  enableNotify() {
    this.enableN = !this.enableN;
  }
}
