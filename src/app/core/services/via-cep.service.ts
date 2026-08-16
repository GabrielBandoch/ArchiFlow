import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UrlBuilder } from '../utils/url-builder';
import { ViaCepResponse } from '../../models/via-cep.model';

@Injectable({
  providedIn: 'root'
})
export class ViaCepService {
  private http = inject(HttpClient);

  buscarCep(cep: string): Observable<ViaCepResponse | null> {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      return of(null);
    }

    const url = new UrlBuilder('https://viacep.com.br')
      .segment('ws')
      .segment(cepLimpo)
      .segment('json')
      .build();

    return this.http.get<ViaCepResponse>(url).pipe(
      map(res => (res && !res.erro) ? res : null),
      catchError(() => of(null))
    );
  }
}
