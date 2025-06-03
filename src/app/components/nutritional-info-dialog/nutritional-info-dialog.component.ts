import { NgFor, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface NutritionColumn {
  key: string;
  label: string;
}

@Component({
  selector: 'app-nutritional-info-dialog',
  templateUrl: './nutritional-info-dialog.component.html',
  styleUrls: ['./nutritional-info-dialog.component.scss'],
  imports:[NgFor]
})
export class NutritionalInfoDialogComponent {
  processedColumns: NutritionColumn[] = [];
  maxColumnsToShow = 5; // Ajuste conforme necessário

  constructor(
    public dialogRef: MatDialogRef<NutritionalInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.processData(data.nutritionalData);
  }

  processData(data: any[]) {
  if (!data || data.length === 0) return;

  const keysSet = new Set<string>();
  data.forEach(item => {
    Object.keys(item).forEach(key => {
      if (!['componente', 'unidade'].includes(key)) {
        keysSet.add(key);
      }
    });
  });

  this.processedColumns = Array.from(keysSet).map(key => ({
    key,
    label: this.formatColumnLabel(key)
  }));
}

formatColumnLabel(key: string): string {
  if (key.includes('(')) {
    return key.split('(')[0].trim();
  }
  return key;
}

  onClose(): void {
    this.dialogRef.close();
  }

  shouldStackView(): boolean {
    return this.processedColumns.length > this.maxColumnsToShow;
  }
}