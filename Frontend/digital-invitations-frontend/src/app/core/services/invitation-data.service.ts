import { Injectable } from '@angular/core';
import { InvitationData } from '../models/invitation.model';

@Injectable({
  providedIn: 'root'
})
export class InvitationDataService {

  private invitationData: InvitationData = {
    couple: {
      name1: 'Ana',
      name2: 'Alberto',
      vow1: '"Coincidir entre tanta gente no debió ser casualidad, sino destino."',
      vow2: '"Mis temores se marchan cada vez que me abrazas y me aseguras que todo irá bien."'
    },
    eventTitle: 'Boda de Ana y Alberto',
    fullEventTitle: 'Boda de<br>Ana y Alberto',
    date: '2025-09-20T12:00:00',
    story: {
      mainImageUrl: 'assets/images/photos/main-image.jpeg',
      children: [
        { name: 'Luis Manuel Hernández', photo: 'assets/images/photos/son-4.jpg' },
        { name: 'Paola Horta Rojas', photo: 'assets/images/photos/son-5.jpg' },
      ]
    },
    events: [
      {
        name: 'Ceremonia',
        location: 'Templo Cristo de la Montaña',
        address: 'Xocoyotzin 209, zona dos extendida, Azteca, 76085 Santiago de Querétaro, Qro.',
        time: '12:45 PM',
        mapUrl: 'https://g.co/kgs/wTHKAFo',
        imageUrl: '/assets/images/photos/church.png',
        imageOrder: 'right',
        dressCode: null
      },
      {
        name: 'Hospedaje cercano',
        location: 'Campestre Italiana',
        address: 'Villas del Cimatario 76087 Santiago de Querétaro, Qro.',
        time: '',
        mapUrl: 'https://maps.app.goo.gl/Ld9r8odu7PJa6gsT7',
        imageUrl: '/assets/images/photos/venue.png',
        imageOrder: 'left',
        //dressCode: {
        //  title: 'Vestimenta Formal',
        //  icons: ['/assets/icons/vestido.svg', '/assets/icons/traje.svg']
        //}
      }
    ],
    godparents: [
      { type: '', icon: 'assets/icons/rings.png', names: ['Yolanda Guevara Silva', 'Fiwel Chávez Trejo Jijos', 'Jonathan Israel González', ' Joshua Israel González Ruiz'] },
      //{ type: 'Fotografía', icon: 'assets/icons/camera.png', names: ['Joshua Michael Pasten Juárez'] },
      //{ type: 'Pastel', icon: 'assets/icons/cake.png', names: ['María Antonieta Pérez Hernández', 'Daniel Vega de la Rosa'] }
    ],
    itinerary: [
      { time: '12:00', title: 'Ceremonia Religiosa', icon: '/assets/icons/church.png' },
      { time: '15:30', title: 'Recepción y Cóctel', icon: '/assets/icons/drink.png' },
      { time: '16:00', title: 'Sesión de Fotos', icon: '/assets/icons/camera.png' },
      { time: '17:00', title: 'Comida', icon: '/assets/icons/comida.png' },
      { time: '18:00', title: '¡A bailar!', icon: '/assets/icons/music-dance.png' },
      { time: '20:00', title: 'Brindis', icon: '/assets/icons/glass.png' },
      { time: '20:15', title: 'Baile de los Novios', icon: '/assets/icons/dance.png' },
      { time: '21:00', title: 'Corte de Pastel', icon: '/assets/icons/cake.png' },
      { time: '21:20', title: '¡Disfruta la Fiesta!', icon: '/assets/icons/music-dance.png' }
    ],
    photoGallery: [
      { src: '/assets/images/photos/couple-7.jpg', alt: 'Foto de galería 1' },
      { src: '/assets/images/photos/couple-8.jpg', alt: 'Foto de galería 2' },
      { src: '/assets/images/photos/couple-9.jpg', alt: 'Foto de galería 3' },
      { src: '/assets/images/photos/couple-10.jpg', alt: 'Foto de galería 4' },

    ],
    giftRegistry: {
      message: "El mejor regalo es tu presencia, pero si deseas obsequiarnos algo más, puedes hacerlo de las siguientes maneras:",
      stores: [
        { name: 'Liverpool', logoUrl: '/assets/images/logos/liverpool.png', link: '#' },
        { name: 'Amazon', logoUrl: '/assets/images/logos/amazon.png', link: '#' }
      ],
      bankAccount: {
        message: "O si prefieres, puedes apoyarnos con un regalo en efectivo:",
        bank: "BBVA",
        accountHolder: "Ana Pérez Ramírez",
        clabe: "1234 5678 9012 345678"
      }
    },
    componentVisibility: {
      welcomeScreen: 1,
      musicPlayer: 1,
      story: 1,
      countdown: 1,
      godparents: 1,
      eventDetails: 1,
      photoGallery: 1,
      giftRegistry: 0,
      itinerary: 1,
      rsvpForm: 1,
      footer: 1
    }
  };

  getInvitationData(): InvitationData {
    return this.invitationData;
  }
} 