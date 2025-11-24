import { Component, OnInit } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-historia',
  templateUrl: './historia.component.html',
  styleUrls: ['./historia.component.scss'],
  imports: [CommonModule, IonicModule]
})
export class HistoriaComponent implements OnInit {

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  cerrar() {
    this.modalCtrl.dismiss();
  }
}

