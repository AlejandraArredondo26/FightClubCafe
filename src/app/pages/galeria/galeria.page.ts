import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-galeria',
  templateUrl: './galeria.page.html',
  styleUrls: ['./galeria.page.scss'],
})
export class GaleriaPage {
  viewerOpen = false;
  currentSrc = '';
  
}


