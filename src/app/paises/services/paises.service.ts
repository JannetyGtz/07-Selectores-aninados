import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/pais.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _baseUrl: string = 'https://restcountries.com/v3.1/';
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(): string[] {
    return [...this._regiones];
  }
  constructor(private http: HttpClient) { }


  getPaisesPorRegion(region: string): Observable<PaisSmall[] | null> {

    if (!region) {
      return of(null)
    }
    const url: string = `${this._baseUrl}/region/${region}?fields=ccn3,name`
    return this.http.get<PaisSmall[]>(url);
  }

  getPaisPorCodigo(ccn3: string) : Observable<Pais[] | null> {

    if (!ccn3) {
      return of(null)
    }
    const url: string = `${this._baseUrl}/alpha/${ccn3}`
    return this.http.get<Pais[]>(url);
  }

  getPaisPorCodigoSmall(ccn3: string) : Observable<PaisSmall> {
    const url: string = `${this._baseUrl}/alpha/${ccn3}?fields=ccn3,name`
    return this.http.get<PaisSmall>(url);
  }

  getPaisesPorCodigos(borders: string[]): Observable<PaisSmall[]> {
    if (!borders) {
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach( codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push(peticion);
    })

    // El combinelates nos permite disparar todas las peticiones de manera simultanea.
    return combineLatest(peticiones);
  }
}
