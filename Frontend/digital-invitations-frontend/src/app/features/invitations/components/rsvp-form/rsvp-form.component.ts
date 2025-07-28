import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-rsvp-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rsvp-form.component.html',
  styleUrls: ['./rsvp-form.component.scss']
})
export class RsvpFormComponent implements OnInit {
  // Simulación de datos de la invitación
  invitationTo = "Familia Hernández";
  predefinedGuests = [
    { name: 'Sarai Flores', isEditable: false },
    { name: 'Mauricio Garcia', isEditable: false },
    { name: 'Acompañante 3', isEditable: true },
    { name: 'Acompañante 4', isEditable: true }
  ];

  rsvpForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.rsvpForm = this.fb.group({
      guests: this.fb.array([]),
      message: ['']
    });
  }

  ngOnInit() {
    this.initializeGuestForms();
  }

  get guests(): FormArray {
    return this.rsvpForm.get('guests') as FormArray;
  }

  initializeGuestForms() {
    this.predefinedGuests.forEach(guest => {
      this.guests.push(this.fb.group({
        name: [guest.name],
        isEditable: [guest.isEditable],
        attendance: ['attending'] // 'attending' o 'not_attending'
      }));
    });
  }

  onSubmit() {
    console.log('Confirmación enviada:', this.rsvpForm.value);
    alert('¡Gracias por tu respuesta!');
  }
} 