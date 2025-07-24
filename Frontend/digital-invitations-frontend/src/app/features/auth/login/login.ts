import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {

}
