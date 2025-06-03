// food-item.model.ts
export interface FoodItem {
  id: any;
  nome: string;
  grupo: string;
  codigo: string;
  tabelaNutricional: string;
  status?: 'ativo' | 'inativo';
}

