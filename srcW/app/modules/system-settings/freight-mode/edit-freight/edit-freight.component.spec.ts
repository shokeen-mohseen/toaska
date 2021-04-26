import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFreightComponent } from './edit-freight.component';

describe('EditFreightComponent', () => {
  let component: EditFreightComponent;
  let fixture: ComponentFixture<EditFreightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFreightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFreightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
