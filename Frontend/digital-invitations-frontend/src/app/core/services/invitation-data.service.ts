import { Injectable } from '@angular/core';
import { InvitationData } from '../models/invitation.model';

@Injectable({
  providedIn: 'root'
})
export class InvitationDataService {

  private invitationData: InvitationData = {
    couple: {
      name1: 'Jocelyn Jazmín Ruiz Chávez',
      name2: 'Hugo Israel González Mendoza',
      vow1: '"Amor, no puedo imaginar mi futuro sin ti, agradezco a Dios que nos cruzáramos en nuestros caminos, disfruto cada minuto que pasamos juntos y quiero compartir mi vida contigo, te amoooo para siempre en tus días buenos y tus días no tan buenos, en los que estaré a tu lado para recordarte que vendrán tiempos mejores."',
      vow2: '"Amor no tengo duda de que llegaste en el momento preciso y que fue Dios quién te envió. Siempre le estaré agradecido. En todo momento me he sentido afortunado de que podamos recorrer juntos este camino llamado vida y estoy más que emocionado de continuar el trayecto en esta nueva etapa. Estoy contigo en las buenas y más aún en las no tan buenas, tomando tu mano para formar ese equipo que se enfrentara a cualquier reto de la vida."',
    },
    eventTitle: 'Bodas de Plata de Jocelyn y Hugo',
    eventMainTitle: 'Bodas de Plata',
    eventCoupleNamesTitle: 'Jocelyn y Hugo',
    date: '2025-09-20T12:00:00',
    story: {
      mainImageUrl: 'assets/images/photos/main-image.jpeg',
      children: [
        { name: 'Joshua Israel González Ruiz', photo: 'assets/images/photos/son-4.jpg' },
        { name: 'Jonathan Israel González Ruiz', photo: 'assets/images/photos/son-5.jpg' },
      ]
    },
    events: [
      {
        name: 'Ceremonia',
        location: 'Templo Cristo de la Montaña',
        address: 'Xocoyotzin 209, zona dos extendida, Azteca, 76085 Santiago de Querétaro, Qro.',
        time: '12:45 PM',
        mapUrl: 'https://maps.app.goo.gl/As2gwd7XVnMoA3RF8',
        imageUrl: '/assets/images/photos/church.png',
        imageOrder: 'right',
        dressCode: null
      },
      {
        name: 'Lugar del evento',
        location: 'Casa Ejidal Casa Blanca.',
        address: 'Calle boticelli 187. Campestre Italiana. Qro, qro',
        time: '',
        mapUrl: 'https://maps.google.com/?q=20.544497,-100.374336',
        imageUrl: '/assets/images/photos/venue.jpeg',
        imageOrder: 'left', // Asegura el orden alternado en escritorio
        //dressCode: {
        //  title: 'Vestimenta Formal',
        //  icons: ['/assets/icons/vestido.svg', '/assets/icons/traje.svg']
        //}
      },
      {
        name: 'Hospedaje cercano',
        location: 'Hotel Ibis Querétaro',
        address: 'Prol. Bernardo Quintana 302 Col, Centro Sur, 76090 Santiago de Querétaro, Qro.',
        time: '',
        mapUrl: 'https://maps.app.goo.gl/tJ63mnRAybKZnqENA?g_st=aw',
        imageUrl: '/assets/images/photos/venue2.png',
        imageOrder: 'right', // Asegura el orden alternado en escritorio
        //dressCode: {
        //  title: 'Vestimenta Formal',
        //  icons: ['/assets/icons/vestido.svg', '/assets/icons/traje.svg']
        //}
      },
      {
        name: 'Hospedaje cercano',
        location: 'Hotel Florencia By Marho Hotels',
        address: 'Prol. Av. Zaragoza 101-Pte, Jardines de la Hacienda, 76180 Santiago de Querétaro, Qro.',
        time: '',
        mapUrl: 'https://maps.app.goo.gl/b5SkP8mmnBXncJr9A', 
        imageUrl: '/assets/images/photos/venue3.png',
        imageOrder: 'left', // Asegura el orden alternado en escritorio
        //dressCode: {
        //  title: 'Vestimenta Formal',
        //  icons: ['/assets/icons/vestido.svg', '/assets/icons/traje.svg']
        //}
      }
    ],
    godparents: [
      { type: '', icon: 'assets/icons/rings.png', names: ['Yolanda Guevara Silva', 'Fidel Chávez Trejo'] },
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
      { src: '/assets/images/photos/couple-9.jpg', alt: 'Foto de galería 3' },
      { src: '/assets/images/photos/couple-7.jpg', alt: 'Foto de galería 1' },
      { src: '/assets/images/photos/couple-8.jpg', alt: 'Foto de galería 2' },
      { src: '/assets/images/photos/couple-11.jpg', alt: 'Foto de galería 4' },

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
      itinerary: 0,
      rsvpForm: 1,
      footer: 1
    },
    rsvp: {
      whatsappNumber: "+524422857766"
    },
    assets: {
      flowerCorner: 'assets/images/elements/flower-corner.png',
      flowerDivider: 'assets/images/elements/flower-divider.png'
    }
  };

  getInvitationData(): InvitationData {
    return this.invitationData;
  }
} 