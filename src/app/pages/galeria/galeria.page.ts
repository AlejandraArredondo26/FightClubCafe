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
  currentDescripcion = '';

  descripciones: { [key: string]: string } = {
    'assets/images/tavern.jpeg': 'La taberna principal donde los aventureros se reúnen.',
    'assets/images/1.jpeg': 'Scripts del Mago Magito.',
    'assets/images/2.jpeg': 'Ilustración del ring de pelea',
    'assets/images/3.jpeg': 'Entrada de la cafetaverna.',
    'assets/images/4.jpeg': 'Ilustración del item 1.',
    'assets/images/5.jpeg': 'Ilustración del item 2.',
    'assets/images/6.jpeg': 'Ilustración del item 3.',
    'assets/images/7.jpeg': 'Ilustración del item 4.',
    'assets/images/8.jpeg': 'Scripts Mr.Bald.',
    'assets/images/9.jpeg': 'Scripts Mafioso Mafito.',
    'assets/images/10.jpeg': 'Scrpts Hierro Rojo.',
    'assets/images/11.jpeg': 'Scripts Tavernero.',
    'assets/images/12.jpeg': 'Scripts Jerry el ratón vaquero.',
  };

  abrirImagen(src: string) {
    this.currentSrc = src;
    this.currentDescripcion = this.descripciones[src] || 'Imagen sin descripción.';
    this.viewerOpen = true;
  }
}
