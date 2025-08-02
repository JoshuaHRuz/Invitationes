export interface ComponentVisibility {
  welcomeScreen: 0 | 1;
  musicPlayer: 0 | 1;
  story: 0 | 1;
  countdown: 0 | 1;
  godparents: 0 | 1;
  eventDetails: 0 | 1;
  photoGallery: 0 | 1;
  giftRegistry: 0 | 1;
  itinerary: 0 | 1;
  rsvpForm: 0 | 1;
  footer: 0 | 1;
}

export interface Attendee {
  name: string;
  isEditable: boolean;
}

export interface GuestGroup {
  groupName: string;
  allowedPasses: number;
  attendees: Attendee[];
}

export interface InvitationData {
  couple: {
    name1: string;
    name2: string;
    vow1: string;
    vow2: string;
  };
  eventTitle: string;
  fullEventTitle: string;
  date: string; // Formato YYYY-MM-DDTHH:mm:ss
  story: {
    mainImageUrl: string;
    children: { name: string; photo: string; }[];
  };
  events: {
    name: string;
    location: string;
    address: string;
    time: string;
    mapUrl: string;
    imageUrl: string;
    imageOrder: 'left' | 'right';
    dressCode?: {
      title: string;
      icons: string[];
    } | null;
  }[];
  godparents: {
    type: string;
    icon: string;
    names: string[];
  }[];
  itinerary: {
    time: string;
    title: string;
    icon: string;
  }[];
  photoGallery: {
    src: string;
    alt: string;
  }[];
  giftRegistry: {
    message: string;
    stores: {
      name: string;
      logoUrl: string;
      link: string;
    }[];
    bankAccount: {
      message: string;
      bank: string;
      accountHolder: string;
      clabe: string;
    };
  };
  componentVisibility: ComponentVisibility;
  guestGroup?: GuestGroup;
  rsvp: {
    whatsappNumber: string;
  };
  assets?: {
    flowerCorner: string;
    flowerDivider: string;
  };
} 