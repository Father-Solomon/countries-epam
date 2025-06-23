export interface RawCountryEntry {
  country: string;
  region: string;
}

export interface CountryApiResponse {
  status: string;         // "OK"
  'status-code': number;  // 200
  version: string;        // "1.0"
  access: string;         // "public"
  total: number;          // 249
  offset: number;
  limit: number;
  data: Record<string, RawCountryEntry>;  // key = alpha-2 code (e.g. "DZ")
}
