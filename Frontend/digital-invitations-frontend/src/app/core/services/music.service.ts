import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  private playMusicSource = new Subject<void>();

  playMusic$ = this.playMusicSource.asObservable();

  triggerPlayMusic() {
    this.playMusicSource.next();
  }
} 