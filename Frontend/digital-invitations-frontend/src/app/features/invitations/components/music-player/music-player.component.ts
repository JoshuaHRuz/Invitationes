import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-music-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.scss']
})
export class MusicPlayerComponent implements AfterViewInit {
  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;
  
  isPlaying: boolean = false;

  ngAfterViewInit() {
    // Para algunos navegadores, la reproducción automática solo se permite después de la interacción del usuario.
    // Podríamos intentar reproducir aquí si las políticas del navegador lo permiten.
  }

  togglePlay(): void {
    const audioPlayer = this.audioPlayerRef.nativeElement;
    if (this.isPlaying) {
      audioPlayer.pause();
    } else {
      audioPlayer.play();
    }
    this.isPlaying = !this.isPlaying;
  }
} 