import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionInterventionComponent } from './gestion-intervention.component';

describe('GestionInterventionComponent', () => {
  let component: GestionInterventionComponent;
  let fixture: ComponentFixture<GestionInterventionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionInterventionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
