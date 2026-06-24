import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AddFormationDialogComponent } from '../add-formation-dialog/add-formation-dialog.component';


@Component({
  selector: 'app-admin-interface',
  templateUrl: './admin-interface.component.html',
  styleUrls: ['./admin-interface.component.css'],
})
export class AdminInterfaceComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

    navigateToAddFormation(): void {
  
      this.dialog.open(
  
        AddFormationDialogComponent,
  
        {
  
          width: '500px',
  
          disableClose: true
  
        }
  
      );
  
      }

};
