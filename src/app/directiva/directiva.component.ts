
import { Component } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html'
})
export class DirectivaComponent {

  Cadena: string[] = ['Angular','TypeScript', 'JavaScript', 'Java 11', 'Spring', 'Mysql Database'];

  habilitar: boolean = true;

  constructor() { }

  setHabilitar(): void {
    this.habilitar = (this.habilitar == true) ? false : true;
  }

}
