import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss']
})
export class PhotoGalleryComponent {
  photos = [
    { src: '/assets/images/photos/couple-1.png', alt: 'Foto de galería 1' },
    { src: '/assets/images/photos/couple-2.png', alt: 'Foto de galería 2' },
    { src: '/assets/images/photos/couple-3.png', alt: 'Foto de galería 3' },
    { src: '/assets/images/photos/couple-4.png', alt: 'Foto de galería 4' },
    { src: '/assets/images/photos/couple-5.png', alt: 'Foto de galería 5' },
    { src: '/assets/images/photos/couple-6.png', alt: 'Foto de galería 6' },
  ];
} 