import { Component } from '@angular/core';
import { FoodCardComponent } from './components/food-card/food-card.component';


@Component({
  selector: 'app-root',
  imports: [FoodCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'food';
}
