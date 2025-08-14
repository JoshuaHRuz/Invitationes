import { Component, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ToastService {
  message = '';
  type: 'success' | 'error' | 'info' = 'info';
  visible = false;
  show(message: string, type: 'success'|'error'|'info' = 'info', durationMs = 2000) {
    this.message = message;
    this.type = type;
    this.visible = true;
    setTimeout(() => this.visible = false, durationMs);
  }
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="toast" [class.show]="svc.visible" [class.success]="svc.type==='success'" [class.error]="svc.type==='error'">{{ svc.message }}</div>`,
  styles: [
    `.toast{position:fixed;right:16px;bottom:16px;padding:10px 14px;border-radius:8px;background:#111827;color:#fff;opacity:0;transform:translateY(8px);transition:all .2s}`,
    `.toast.show{opacity:1;transform:translateY(0)}`,
    `.toast.success{background:#0ea5e9}`,
    `.toast.error{background:#dc2626}`
  ]
})
export class ToastComponent {
  constructor(public svc: ToastService) {}
}


