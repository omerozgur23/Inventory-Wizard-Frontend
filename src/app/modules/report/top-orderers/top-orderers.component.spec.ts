import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopOrderersComponent } from './top-orderers.component';

describe('TopOrderersComponent', () => {
  let component: TopOrderersComponent;
  let fixture: ComponentFixture<TopOrderersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopOrderersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopOrderersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
