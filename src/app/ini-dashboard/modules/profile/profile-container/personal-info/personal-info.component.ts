import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApplicationContextService } from '@app/shared/services/application-context.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit {

  infoForm!: FormGroup;
  container: any = {};
  userInformation!: any;

  constructor(
    private fb: FormBuilder,
    public appContext: ApplicationContextService,
    ) { }

  ngOnInit() {
    this.appContext
    .getUserInformation()
    .subscribe({
      next: (data: any) => {
        this.userInformation = data;
        this.infoForm = this.fb.group({
          fullName: [this.userInformation?.firstName + ' ' + this.userInformation?.lastName],
          email: [this.userInformation?.email],
          phone: [this.userInformation?.phone],
          address: ['']
      })

      },
    });

  }

}


