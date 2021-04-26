import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFreightlaneComponent } from './edit-freightlane.component';

describe('EditFreightlaneComponent', () => {
  let component: EditFreightlaneComponent;
  let fixture: ComponentFixture<EditFreightlaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFreightlaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFreightlaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
