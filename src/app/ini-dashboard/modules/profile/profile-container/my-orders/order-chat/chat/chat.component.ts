import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, ViewChild, } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Socket } from 'ngx-socket-io';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';
import { BehaviorSubject, Observable, map, mergeMap, scan, tap, throttleTime } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit {
  // https://www.youtube.com/watch?v=cUNmtRNc-8s
  @ViewChild('scrollViewport') viewport: CdkVirtualScrollViewport;
  msgForm!: FormGroup;
  chats = new Array
  container = {};

  @Input() data: any;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    // public dialogRef: MatDialogRef<ChatComponent>,
    private appContext: ApplicationContextService,
    private socket: Socket,
    private http: HttpClient,
  ) {

  }
  ngOnInit() {
    console.log(this.data);

    // console.log(this.data);
    this.msgForm = this.fb.group({
      message: [null, [Validators.required ],],
    });
    this.appContext
      .getUserInformation()
      .subscribe((user: any) => {
        this.container['user'] = user;
          this.container['sessionUsers'] = { sessionId: this.data.id, participants: [{userId: user.id, tenantId: this.data.Tenant?.id}] }

          this.socket.emit('get-session-users', this.container['sessionUsers']);
          this.socket.emit('get-session-chats', { sessionId: this.data.id });
      });
  }

  onChatSubmit(chat: any) {
    chat = { ...chat, userId: this.container['user']?.id, timestamp: new Date().toString(), strike: false };
    this.chats = [...this.chats, chat];
    this.msgForm.patchValue({message: null});
    this.saveChat(chat);
  }

  saveChat(chat: any) {
    this.http.post(`${environment.baseApiUrl}/chats`, chat)
              .subscribe({
                next: (response: any) => {
                  chat.delivered = true;
                },
                error: (err: any) => {
                  chat.strike = true
                }
              })
  }

  calculateContainerHeight(): string {
    const numberOfItems = this.chats.length;
    // This should be the height of your item in pixels
    const itemHeight = 50;
    // The final number of items you want to keep visible
    const visibleItems = 10;

    setTimeout(() => {
      // Makes CdkVirtualScrollViewport to refresh its internal size values after
      // changing the container height. This should be delayed with a "setTimeout"
      // because we want it to be executed after the container has effectively
      // changed its height. Another option would be a resize listener for the
      // container and call this line there but it may requires a library to detect
      // the resize event.

      this.viewport.checkViewportSize();
    }, 300);

    // It calculates the container height for the first items in the list
    // It means the container will expand until it reaches `300px` (30 * 10)
    // and will keep this size.
    if (numberOfItems <= visibleItems) {
      return `${itemHeight * numberOfItems}px`;
    }

    // This function is called from the template so it ensures the container will have
    // the final height if number of items are greater than the value in "visibleItems".
    return `${itemHeight * visibleItems}px`;
  }
}
