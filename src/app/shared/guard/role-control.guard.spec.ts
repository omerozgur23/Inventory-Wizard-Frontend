import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { roleControlGuard } from './role-control.guard';

describe('roleControlGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => roleControlGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
