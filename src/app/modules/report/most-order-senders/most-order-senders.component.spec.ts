import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostOrderSendersComponent } from './most-order-senders.component';

describe('MostOrderSendersComponent', () => {
  let component: MostOrderSendersComponent;
  let fixture: ComponentFixture<MostOrderSendersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MostOrderSendersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MostOrderSendersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
