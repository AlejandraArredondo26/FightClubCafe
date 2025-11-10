import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Hero, Personaje } from 'src/app/interfaces/interfaces';
import { Personajes } from 'src/app/services/personajes';

@Component({
  standalone: false,
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent {
  detallePersonaje={} as Personaje;
  @Input() hero?: Hero;
  @Input() id!: string;

  constructor(private modalCtrl: ModalController,private personajesService: Personajes) { }
  cerrar() { this.modalCtrl.dismiss(); }

  // promedio de stats para mostrar rareza estilo videojuego
  get promedio(): number {
    const p = this.hero?.powerstats as any;
    if (!p) return 0;
    const vals: number[] = ['intelligence', 'strength', 'speed', 'durability', 'power', 'combat']
      .map(k => typeof p?.[k] === 'number' ? p[k] as number : NaN)
      .filter(v => !isNaN(v));
    if (!vals.length) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }

  get rareza(): 'raro' | 'epico' | 'legendario' {
    const avg = this.promedio;
    if (avg >= 80) return 'legendario';
    if (avg >= 60) return 'epico';
    return 'raro';
  }

  statValue(key: keyof NonNullable<Hero['powerstats']>): number {
    const v = this.hero?.powerstats?.[key];
    return typeof v === 'number' ? v : 0;
  }
  ngOnInit() {
    /*Realizamos la llamada a la función getPersonajesDetalle pasando el id
    perteneciente al personaje seleccionado*/
    this.personajesService.getPersonajesDetalle(this.id).subscribe(respuesta => {
      //Almacenamos al personaje en el objeto.
      this.detallePersonaje = <Personaje>respuesta;
    });
  }

}
