import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, NavbarComponent, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  readonly fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  loading = false;
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
    if (this.form.invalid || this.form.value.password !== this.form.value.confirmPassword) {
      this.form.markAllAsTouched();
      this.error = 'Verifica los campos y que las contraseñas coincidan';
      return;
    }
    this.loading = true;
    this.error = null;
    const { name, email, password } = this.form.getRawValue();
    this.auth.signup({ name, email, password }).subscribe({
      next: () => this.router.navigateByUrl('/auth/login'),
      error: (err) => {
        this.error = 'No se pudo registrar. Intenta con otro correo';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
