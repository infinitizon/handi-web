import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { environment } from '@environments/environment';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';
import { CommonService } from '@app/_shared/services/common.service';
import { GMapService, Maps } from '@app/_shared/services/google-map.service';

@Component({
  selector: 'app-view-inbox',
  templateUrl: './view-inbox.component.html',
  styleUrls: ['./view-inbox.component.scss'],
})
export class ViewInboxComponent implements OnInit {
  @Input() data: any;
  @ViewChild('search') searchElementRef: ElementRef = {
    nativeElement: undefined,
  };
  container: any = { countdown: 20 };
  userInformation!: any;
  msgForm!: FormGroup;
  chats = new Array

  submitting = false;
  id: any;
  categories: any;
  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private http: HttpClient,
    private commonServices: CommonService,
    public appContext: ApplicationContextService
  ) {
  }

  ngOnInit() {
    this.msgForm = this.fb.group({
      message: [null, [Validators.required ],],
    });
    this.appContext
      .getUserInformation()
      .subscribe((user: any) => {
        this.container['user'] = user;
          this.container['sessionUsers'] = { sessionId: this.data.id, participants: [{userId: user.id, tenantId: this.data.Tenant?.id}] }
      });

    this.http.get(`${environment.baseApiUrl}/chats/get-chats`)
      .subscribe({
        next: (response: any) => {
          this.container['sessions'] = response.data
        },
        error: (err: any) => {
        }
      })
  }

  startSession(session) {
    this.http.post(`${environment.baseApiUrl}/chats/claim-session`, {session})
              .subscribe({
                next: (response: any) => {
                },
                error: (err: any) => {
                }
              })
  }
  onChatSubmit(chat: any) {
    chat = { ...chat, userId: this.container['user']?.id, timestamp: new Date().toString(), strike: false };
    this.chats = [...this.chats, chat];
    this.msgForm.patchValue({message: null});
    this.saveChat(chat);
  }
  saveChat(chat: any) {
    this.http.post(`${environment.baseApiUrl}/chats/messages`, chat)
              .subscribe({
                next: (response: any) => {
                  chat.delivered = true;
                },
                error: (err: any) => {
                  chat.strike = true
                }
              })
  }
}
