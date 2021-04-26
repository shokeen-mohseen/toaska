import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditLocationCharacteristicsComponent } from './addedit-location-characteristics.component';

describe('AddeditLocationCharacteristicsComponent', () => {
  let component: AddeditLocationCharacteristicsComponent;
  let fixture: ComponentFixture<AddeditLocationCharacteristicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddeditLocationCharacteristicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditLocationCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
