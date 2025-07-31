package com.invitationes.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode(exclude = {"events", "godparents", "itinerary", "photoGallery", "guestGroups"})
public class Invitation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "host_id")
    private User host;

    private String eventName;
    private String fullEventTitle;
    private LocalDateTime date;

    private String coupleName1;
    private String coupleName2;
    private String vow1;
    private String vow2;

    private String storyMainImageUrl;

    private boolean showWelcomeScreen;
    private boolean showMusicPlayer;
    private boolean showStory;
    private boolean showCountdown;
    private boolean showGodparents;
    private boolean showEventDetails;
    private boolean showPhotoGallery;
    private boolean showGiftRegistry;
    private boolean showItinerary;
    private boolean showRsvpForm;
    private boolean showFooter;

    @OneToMany(mappedBy = "invitation")
    private List<Event> events;
    @OneToMany(mappedBy = "invitation")
    private List<Godparent> godparents;
    @OneToMany(mappedBy = "invitation")
    private List<ItineraryItem> itinerary;
    @OneToMany(mappedBy = "invitation")
    private List<Photo> photoGallery;
    @OneToMany(mappedBy = "invitation")
    private List<GuestGroup> guestGroups;
}