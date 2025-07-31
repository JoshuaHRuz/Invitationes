package com.invitationes.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Entity
@Data
@EqualsAndHashCode(exclude = {"invitations"})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;

    private String passwordHash;

    private String name;

    // Relación con invitaciones (un usuario puede tener múltiples invitaciones)
    @OneToMany(mappedBy = "host")
    private List<Invitation> invitations;
}