import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController, IonContent } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Personajes } from 'src/app/services/personajes';
import { Hero, Personaje } from 'src/app/interfaces/interfaces';
import { DetalleComponent } from 'src/app/componentes/detalle/detalle.component';
import { ComponentesModule } from 'src/app/componentes/componentes-module';

@Component({
  standalone: true,
  selector: 'app-inicio',
  imports: [CommonModule, FormsModule, IonicModule, ComponentesModule],
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  // heroes: Hero[] = [];
  cargando = false;
  @ViewChild('infoSection') infoSection?: ElementRef;
  @ViewChild(IonContent) content?: IonContent;
  personajesRecientes:Personaje[]= [];

  constructor(private personajesSrv: Personajes, private modalCtrl: ModalController) { }

  //ngOnInit() {
  //this.cargando = true;
  //this.personajesSrv.getHeroes(20).subscribe({
  //next: (heroes) => {
  //this.heroes = heroes;
  //this.cargando = false;
  //},
  //error: () => {
  //this.cargando = false;
  // }
  // });
  //}

  ngOnInit() {
    //Realizamos la llamada a la función getPersonajes
     this.personajesSrv.getPersonajes().subscribe((respuesta) => {
      respuesta.forEach(personaje=>{
        this.personajesRecientes.push(<Personaje>personaje);
      })
    });
  
  }

  irAInfo() {
    try {
      const y = (this.infoSection?.nativeElement as HTMLElement)?.offsetTop ?? 0;
      this.content?.scrollToPoint(0, Math.max(y - 12, 0), 600);
    } catch { }
  }

  async abrirModal(id:string) {
     const modal = await this.modalCtrl.create({
       component: DetalleComponent,
       componentProps: { id },
       backdropDismiss: true,
       cssClass: 'detalle-modal'
     });
     await modal.present();
  }

}
