import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chat-pane',
  templateUrl: './chat-pane.component.html',
  styleUrls: ['./chat-pane.component.scss']
})
export class ChatPaneComponent implements OnInit {

  @Input('chats') chats: any;
  @Input('user') user: any;
  @ViewChild('chatPane') private myChatPane: ElementRef;

  constructor() { }

  ngOnInit() {
    this.scrollToBottom();
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
        this.myChatPane.nativeElement.scrollTop = this.myChatPane.nativeElement.scrollHeight;
    } catch(err) { }
}
}
