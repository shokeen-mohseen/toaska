import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdStageDeliveryComponent } from './third-stage-delivery.component';

describe('ThirdStageDeliveryComponent', () => {
  let component: ThirdStageDeliveryComponent;
  let fixture: ComponentFixture<ThirdStageDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThirdStageDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdStageDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
