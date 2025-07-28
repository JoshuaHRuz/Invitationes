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
} 