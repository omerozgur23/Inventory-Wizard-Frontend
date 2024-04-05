import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptProductComponent } from './accept-product.component';

describe('AcceptProductComponent', () => {
  let component: AcceptProductComponent;
  let fixture: ComponentFixture<AcceptProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcceptProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcceptProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
