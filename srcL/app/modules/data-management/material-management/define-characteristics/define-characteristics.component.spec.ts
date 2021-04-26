import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefineCharacteristicsComponent } from './define-characteristics.component';

describe('DefineCharacteristicsComponent', () => {
  let component: DefineCharacteristicsComponent;
  let fixture: ComponentFixture<DefineCharacteristicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefineCharacteristicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefineCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
