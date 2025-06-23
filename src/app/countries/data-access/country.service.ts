import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Country} from '../interfaces/country';
import {map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private http = inject(HttpClient);

  getCountriesChunk(offset: number) {
    return this.http.get<{
      total: number;
      data: Record<string, Omit<Country, 'code'>>;
    }>(`https://api.first.org/data/v1/countries?offset=${offset}&limit=100`)
      .pipe(
        map(res => ({
          total: res.total,
          countries: Object.entries(res.data).map(([code, val]) => ({
            code,
            ...val,
          }))
        }))
      );
  }
}
