import { Component } from '@angular/core';

@Component({
  selector: 'app-message-board',
  standalone: false,
  templateUrl: './message-board.component.html',
  styleUrl: './message-board.scss'
})
export class MessageBoardComponent {
  messages: any[] = [];
}
