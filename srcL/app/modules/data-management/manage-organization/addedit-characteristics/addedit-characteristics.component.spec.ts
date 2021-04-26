import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditCharacteristicsComponent } from './addedit-characteristics.component';

describe('AddeditCharacteristicsComponent', () => {
  let component: AddeditCharacteristicsComponent;
  let fixture: ComponentFixture<AddeditCharacteristicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddeditCharacteristicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
