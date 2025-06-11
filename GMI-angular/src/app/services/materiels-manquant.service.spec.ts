import { TestBed } from '@angular/core/testing';

import { MatrielManquantsService } from './materiels-manquant.service';

describe('MaterielsManquantService', () => {
  let service: MatrielManquantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatrielManquantsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
