import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessCharacteristicsComponent } from './business-characteristics.component';

describe('BusinessCharacteristicsComponent', () => {
  let component: BusinessCharacteristicsComponent;
  let fixture: ComponentFixture<BusinessCharacteristicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessCharacteristicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
