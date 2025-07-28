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
    date: '2025-20-09T12:00:00',
    story: {
      mainImageUrl: 'assets/images/elements/main-image.png',
      children: [
        { name: 'Luis Manuel Hernández', photo: 'assets/images/photos/son-1.png' },
        { name: 'Paola Horta Rojas', photo: 'assets/images/photos/son-2.png' },
        { name: 'José Alberto Vallejo Aguilar', photo: 'assets/images/photos/son-3.png' }
      ]
    },
    events: [
      {
        name: 'Ceremonia',
        location: 'Parroquia del Señor del Calvario',
        address: '15 de Septiembre 45, Culhuacan, Iztapalapa, 09800 Ciudad de México, CDMX',
        time: '12:00 PM',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1882.3486820365415!2d-99.1094656844021!3d19.338934328771078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce01fde9e70707%3A0x1dd1d4dbef37e36d!2sParroquia%20del%20Se%C3%B1or%20del%20Calvario!5e0!3m2!1ses-419!2smx!4v1632863411797!5m2!1ses-419!2smx',
        imageUrl: '/assets/images/photos/church.png',
        imageOrder: 'right',
        dressCode: null
      },
      {
        name: 'Recepción',
        location: 'Hacienda Santa Catarina',
        address: 'Carr a San Bartolomé Xicomulco 579, Santa Cecilia Tepetlapa, Xochimilco, 16880 Ciudad de México, CDMX',
        time: '3:30 PM - 1:00 AM',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.646451725729!2d-99.082305285732!3d19.210638352720135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce0437dbf21e11%3A0xe76e6e2ab267a3f4!2sHacienda%20Santa%20Catarina!5e0!3m2!1ses-419!2smx!4v1632863818303!5m2!1ses-419!2smx',
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
      { src: '/assets/images/photos/couple-7.png', alt: 'Foto de galería 1' },
      { src: '/assets/images/photos/couple-8.png', alt: 'Foto de galería 2' },
      { src: '/assets/images/photos/couple-9.png', alt: 'Foto de galería 3' },
      { src: '/assets/images/photos/couple-10.png', alt: 'Foto de galería 4' },

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