import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegistroPageRoutingModule } from './registro-routing.module';
import { RegistroPage } from './registro.page';
import { ComponentesModule } from 'src/app/componentes/componentes-module';


@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, ComponentesModule, RegistroPageRoutingModule],
  declarations: [RegistroPage]
})
export class RegistroPageModule {}

