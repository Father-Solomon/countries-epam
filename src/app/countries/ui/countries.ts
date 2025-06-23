import {Component, computed, effect, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {CountryService} from '../data-access/country.service';
import {Country} from '../interfaces/country';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {map, of, switchMap} from 'rxjs';

@Component({
  selector: 'app-countries',
  imports: [CommonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './countries.html',
  standalone: true,
  styleUrl: './countries.scss'
})
export class Countries {
  private service = inject(CountryService);

  countries = signal<Country[]>([]);
  selectedRegion = signal<string | null>(null);
  selectedCountryCode = signal<string | null>(null);

  offset = signal(0);
  total = signal(999);
  isLoading = signal(false);


  constructor() {
    this.loadAllChunks();

    // Resets the selected country when the region changes
    effect(() => {
      this.selectedRegion();
      this.selectedCountryCode.set(null);
    });
  }

  // Retrieves the list of unique regions
  regions = computed(() => {
    const set = new Set<string>();
    for (const c of this.countries()) {
      if (c.region) set.add(c.region);
    }
    return Array.from(set).sort();
  });

  // Retrieves countries for the selected region
  countriesByRegion = toSignal(
    toObservable(this.selectedRegion).pipe(
      switchMap(region =>
        region
          ? this.service.getCountries({ region })
          : of({ countries: [] })
      ),
      map(res => res.countries)
    ),
    { initialValue: [] }
  );

  selectedCountryName = computed(() =>
    this.countriesByRegion().find(c => c.code === this.selectedCountryCode())?.country ?? ''
  );

  loadAllChunks() {
    const fetchNext = () => {
      if (this.countries().length >= this.total()) return;

      this.isLoading.set(true);
      this.service.getCountries({ offset: this.offset(), limit: 100 }).subscribe(response => {
        this.total.set(response.total);
        this.countries.update(prev => [...prev, ...response.countries]);
        this.offset.update(n => n + 100);
        this.isLoading.set(false);

        if (this.countries().length < this.total()) {
          fetchNext();
        }
      });
    };

    fetchNext();
  }
}
