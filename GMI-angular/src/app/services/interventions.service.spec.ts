import { TestBed } from '@angular/core/testing';
import { InterventionService } from './interventions.service';


describe('InterventionsService', () => {
  let service: InterventionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterventionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
