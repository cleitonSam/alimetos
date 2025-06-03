import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionalInfoDialogComponent } from './nutritional-info-dialog.component';

describe('NutritionalInfoDialogComponent', () => {
  let component: NutritionalInfoDialogComponent;
  let fixture: ComponentFixture<NutritionalInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NutritionalInfoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NutritionalInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
