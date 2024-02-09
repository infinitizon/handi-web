import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, ViewChild, } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Socket } from 'ngx-socket-io';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';
import { environment } from '@environments/environment';
import { CommonService } from '@app/_shared/services/common.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit {
  // https://www.youtube.com/watch?v=cUNmtRNc-8s
  msgForm!: FormGroup;
  chats = new Array
  container = {};

  @Input() data: any;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    // public dialogRef: MatDialogRef<ChatComponent>,
    private commonServices: CommonService,
    private appContext: ApplicationContextService,
    private socket: Socket,
    private http: HttpClient,
  ) {

  }
  ngOnInit() {
    this.socket.connect()
    this.msgForm = this.fb.group({
      message: [null, [Validators.required ],],
    });
    this.appContext
      .getUserInformation()
      .subscribe((user: any) => {
        this.container['user'] = user;
      });
    this.startSession();
    this.socket.on(`getMessage`, (msg) =>{
      if(msg.userId != this.container['user'].id)
        this.chats = [...this.chats, msg];
    })
  }
  startSession() {
    console.log(`Starting...`,this.data);

    const session = { sessionId: this.data.id, tenantId: this.data?.Tenant?.id }
    this.http.post(`${environment.baseApiUrl}/chats/claim-session`, {session})
              .subscribe({
                next: (response: any) => {
                  this.container['startSessMsg'] = null;

                  this.getChatHistory(session)
                  this.socket.emit(`joinRoom`, {userId: this.container['user'].id, sessionId: this.data.id })
                  this.container['session'] = response.data;
                },
                error: (err: any) => {
                  const msg = `Error claiming session: ${err.message}`;
                  this.container['startSessMsg'] = msg;
                  this.commonServices.snackBar(msg, 'error')
                }
              })
  }

  onChatSubmit(chat: any) {
    chat = { ...chat, userId: this.container['user']?.id, timestamp: new Date().toString(), strike: false, sessionId: this.container['session']?.sessionId};
    this.chats = [...this.chats, chat];
    this.msgForm.patchValue({message: null});
    this.socket.emit(`sendMessage`, chat)
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

  getChatHistory(session) {
    this.http.post(`${environment.baseApiUrl}/chats/history`, session)
            .subscribe({
              next: (response: any) => {
                this.chats = response.data;
              },
              error: (err: any) => {
                this.commonServices.snackBar(err.msg, 'error')
              }
            })

  }

  ngOnDestroy() {
    this.socket.disconnect()
  }
}
