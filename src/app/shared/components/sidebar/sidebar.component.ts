import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserModel } from '../../../core/models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  sidebarCollapsed = false;
  user?: UserModel;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.getUser(); // Asegúrate de que este método devuelva el usuario actual
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
