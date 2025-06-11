import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrielsManquantComponent } from './matriels-manquant.component';

describe('MatrielsManquantComponent', () => {
  let component: MatrielsManquantComponent;
  let fixture: ComponentFixture<MatrielsManquantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatrielsManquantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatrielsManquantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
