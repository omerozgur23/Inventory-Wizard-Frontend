import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfCreateComponent } from './shelf-create.component';

describe('ShelfCreateComponent', () => {
  let component: ShelfCreateComponent;
  let fixture: ComponentFixture<ShelfCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShelfCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShelfCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
