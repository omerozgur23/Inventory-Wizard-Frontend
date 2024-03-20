import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfListComponent } from './shelf-list.component';

describe('ShelfListComponent', () => {
  let component: ShelfListComponent;
  let fixture: ComponentFixture<ShelfListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShelfListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShelfListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
