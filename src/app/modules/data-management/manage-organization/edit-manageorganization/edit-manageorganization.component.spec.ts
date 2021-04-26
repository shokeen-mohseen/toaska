import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditManageorganizationComponent } from './edit-manageorganization.component';

describe('EditManageorganizationComponent', () => {
  let component: EditManageorganizationComponent;
  let fixture: ComponentFixture<EditManageorganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditManageorganizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditManageorganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
