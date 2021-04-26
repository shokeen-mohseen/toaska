import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCharacteristicsComponent } from './add-edit-characteristics.component';

describe('AddEditCharacteristicsComponent', () => {
  let component: AddEditCharacteristicsComponent;
  let fixture: ComponentFixture<AddEditCharacteristicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditCharacteristicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
