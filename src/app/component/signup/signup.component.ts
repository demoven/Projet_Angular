import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  errorPseudo: boolean = false;
  errorPassword: boolean = false;
  user: User = { login: '', password: '', listeIds: [] };

  constructor(private userService: UserService, private router: Router) {
  }
  submit(): void {
    if (this.user.password === "") {
      this.errorPassword = true;
      return;
    }
    else {
      this.userService.signup(this.user).subscribe({
        next: () => { this.router.navigate(['taches']) },
        error: () => { this.errorPseudo = true; }
      });
    }
  }
}



