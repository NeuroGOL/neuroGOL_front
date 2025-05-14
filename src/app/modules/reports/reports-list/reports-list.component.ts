import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerModel } from '../../../core/models/player.model';
import { ReportModel } from '../../../core/models/report.model';
import { PlayerService } from '../../../core/services/player.service';
import { ReportsService } from '../../../core/services/reports.service';

@Component({
  selector: 'app-reports-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports-list.component.html',
  styleUrl: './reports-list.component.css'
})
export class ReportsListComponent {
  playersWithReports: PlayerModel[] = [];
  allReports: ReportModel[] = [];

  constructor(
    private playerService: PlayerService,
    private reportsService: ReportsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPlayersWithReports();
  }

  loadPlayersWithReports() {
    this.reportsService.getReports().subscribe({
      next: (reports) => {
        this.allReports = reports;
        this.playerService.getPlayers().subscribe({
          next: (players) => {
            const playerIdsWithReports = new Set(reports.map(r => r.player_id));
            this.playersWithReports = players.filter(p => playerIdsWithReports.has(p.id));
          }
        });
      }
    });
  }

  viewReportsOfPlayer(playerId: number) {
    this.router.navigate(['/dashboard/reports', playerId]);
  }
}
