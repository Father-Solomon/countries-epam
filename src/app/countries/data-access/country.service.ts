import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Country} from '../interfaces/country';
import {map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private http = inject(HttpClient);

  getCountries(options?: { offset?: number; limit?: number; region?: string }) {
    const params = new HttpParams({
      fromObject: {
        ...(options?.offset != null && { offset: options.offset.toString() }),
        ...(options?.limit != null && { limit: options.limit.toString() }),
        ...(options?.region && { region: options.region })
      }
    });

    return this.http.get<{
      total?: number;
      data: Record<string, Omit<Country, 'code'>>;
    }>('https://api.first.org/data/v1/countries', { params }).pipe(
      map(res => ({
        total: res.total ?? 0,
        countries: Object.entries(res.data).map(([code, val]) => ({
          code,
          ...val
        }))
      }))
    );
  }
}
