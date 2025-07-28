import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicService } from '../../../../core/services/music.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-music-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.scss']
})
export class MusicPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;
  
  isPlaying: boolean = false;
  private playSubscription!: Subscription;

  constructor(private musicService: MusicService) {}

  ngOnInit() {
    this.playSubscription = this.musicService.playMusic$.subscribe(() => {
      this.playAudio();
    });
  }

  ngOnDestroy() {
    if (this.playSubscription) {
      this.playSubscription.unsubscribe();
    }
  }

  togglePlay(): void {
    if (this.isPlaying) {
      this.pauseAudio();
    } else {
      this.playAudio();
    }
  }

  private playAudio() {
    const audioPlayer = this.audioPlayerRef.nativeElement;
    audioPlayer.play();
    this.isPlaying = true;
  }

  private pauseAudio() {
    const audioPlayer = this.audioPlayerRef.nativeElement;
    audioPlayer.pause();
    this.isPlaying = false;
  }
} 