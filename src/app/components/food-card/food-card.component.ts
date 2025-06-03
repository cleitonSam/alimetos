import { NgFor, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FoodService } from '../../service/food-service.service';
import { FoodItem } from '../food-item.model';
import { NutritionalInfoDialogComponent } from '../nutritional-info-dialog/nutritional-info-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-food-card',
  templateUrl: './food-card.component.html',
  styleUrl: './food-card.component.scss',
  standalone: true,
  imports: [NgFor, CommonModule, FormsModule]
})
export class FoodCardComponent implements OnInit {
  foodItems: FoodItem[] = [];
  filteredItems: FoodItem[] = [];
  paginatedItems: FoodItem[] = [];
  uniqueGroups: string[] = [];
  selectedGroup: string = '';
   searchTerm: string = '';
  
  
  // Variáveis de paginação
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(private foodService: FoodService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.foodService.getFoodItems().subscribe({
      next: (items) => {
        this.foodItems = items;
        this.filteredItems = [...items];
        this.extractUniqueGroups();
        this.updatePagination();
      },
      error: (err) => {
        console.error('Erro ao carregar alimentos:', err);
      }
    });
  }

  extractUniqueGroups(): void {
    const groups = new Set(this.foodItems.map(item => item.grupo));
    this.uniqueGroups = Array.from(groups).sort();
  }

  applySearch(): void {
    this.currentPage = 1; // Reset para a primeira página ao buscar
    
    if (!this.searchTerm) {
      this.filteredItems = [...this.foodItems];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredItems = this.foodItems.filter(item => 
        item.nome.toLowerCase().includes(term) || 
        (item.grupo && item.grupo.toLowerCase().includes(term)) ||
        (item.codigo && item.codigo.toString().includes(term))
      );
    }
    
    // Aplicar filtro de grupo se houver um selecionado
    if (this.selectedGroup) {
      this.filteredItems = this.filteredItems.filter(item => item.grupo === this.selectedGroup);
    }
    
    this.updatePagination();
  }


  filterByGroup(group: string): void {
    this.selectedGroup = group;
    this.currentPage = 1;
    
    // Primeiro aplica a busca se houver termo
    if (this.searchTerm) {
      this.applySearch();
    } else {
      this.filteredItems = group 
        ? this.foodItems.filter(item => item.grupo === group)
        : [...this.foodItems];
      this.updatePagination();
    }
  }


  // Métodos de paginação
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedItems = this.filteredItems.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getPages(): number[] {
    const pagesToShow = 5; // Número máximo de páginas para mostrar
    const pages: number[] = [];
    
    // Caso o total de páginas seja menor que o máximo a mostrar
    if (this.totalPages <= pagesToShow) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    
    // Calcular páginas para mostrar com a página atual no meio
    let startPage = Math.max(1, this.currentPage - Math.floor(pagesToShow / 2));
    let endPage = startPage + pagesToShow - 1;
    
    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }


showNutritionalInfo(food: FoodItem): void {
  let parsedData = [];

  try {
    // Substitui aspas simples e faz o parse
    const jsonString = food.tabelaNutricional.replace(/'/g, '"');
    parsedData = JSON.parse(jsonString);
  } catch (e) {
    console.error('Erro ao parsear tabela nutricional:', e);
    parsedData = [];
  }

  this.dialog.open(NutritionalInfoDialogComponent, {
    maxWidth: '95vw',  // Máximo de largura relativo à viewport
  maxHeight: '98vh', 
    data: {
      foodName: food.nome,
      nutritionalData: parsedData
    }
  });
}
}