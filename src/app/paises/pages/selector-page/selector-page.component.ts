import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from "rxjs/operators";
import { PaisesService } from '../../services/paises.service';
import { Pais, PaisSmall } from '../../interfaces/pais.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    //EL siguiente codigo comentado es una manera de inhabilitar el campo frontera
    // frontera: [{value:'', disabled: true}, Validators.required],
    frontera: ['', Validators.required],
  })

  regiones: string[] = [];
  paises: PaisSmall[] = [];
  // fronteras: string[] = [];
  fronteras: PaisSmall[] = [];
  //UI
  cargando: boolean = false;


  constructor(private fb: FormBuilder,
    private paisesService: PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;



    //El pipe permite transformar el valor recibido, disparar otras cosas mediante el switchMap,
    //disparar efectos secundarios con el map, etc.
    //El switchMap es un operador que permite tomar el valor producto (region) de un observable (valueChanges) y hace el switch
    //al valor producto (paises) del nuevo observable (getPaisesPorRegion).
    // con el tap disparamos efectos secundarios, en este caso hacemos un reset al selector país.
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap(_ => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap(region => this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises || [];
        this.cargando = false;
      })


    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap(_ => {
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        switchMap(ccn3 => this.paisesService.getPaisPorCodigo(ccn3)),
        switchMap(pais => this.paisesService.getPaisesPorCodigos(pais?.[0].borders!))
      )
      .subscribe(fronteras => {
        // this.fronteras = pais?.[0].borders || [];
        this.fronteras = fronteras;
        console.log(fronteras);
        this.cargando = false;
      })
  }

  guardar() {
    console.log(this.miFormulario.value);
  }
}
