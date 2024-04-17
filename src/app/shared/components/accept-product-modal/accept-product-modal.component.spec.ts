import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptProductModalComponent } from './accept-product-modal.component';

describe('AcceptProductModalComponent', () => {
  let component: AcceptProductModalComponent;
  let fixture: ComponentFixture<AcceptProductModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcceptProductModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcceptProductModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
