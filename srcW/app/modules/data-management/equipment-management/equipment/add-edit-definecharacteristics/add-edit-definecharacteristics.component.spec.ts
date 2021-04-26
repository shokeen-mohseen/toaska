import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDefinecharacteristicsComponent } from './add-edit-definecharacteristics.component';

describe('AddEditDefinecharacteristicsComponent', () => {
  let component: AddEditDefinecharacteristicsComponent;
  let fixture: ComponentFixture<AddEditDefinecharacteristicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditDefinecharacteristicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditDefinecharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
