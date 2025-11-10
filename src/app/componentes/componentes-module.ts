import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DetalleComponent } from './detalle/detalle.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [HeaderComponent, DetalleComponent],
  exports:[HeaderComponent,DetalleComponent],
  imports: [
    CommonModule,
    IonicModule, ReactiveFormsModule, RouterModule
  ]
})
export class ComponentesModule { }
