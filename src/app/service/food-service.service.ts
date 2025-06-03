import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { FoodItem } from '../components/food-item.model';


@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private apiUrl = 'https://api.sheety.co/129fd1f83f6798ca5c4ea7b7cf138bed/alimentos/alimentos'; 

  constructor(private http: HttpClient) {}

  getFoodItems(): Observable<FoodItem[]> {
    return this.http.get<{ alimentos: FoodItem[] }>(this.apiUrl).pipe(
      map(response => response.alimentos)
    );
  }
}