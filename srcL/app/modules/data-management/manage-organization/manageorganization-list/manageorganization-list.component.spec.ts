import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageorganizationListComponent } from './manageorganization-list.component';

describe('ManageorganizationListComponent', () => {
  let component: ManageorganizationListComponent;
  let fixture: ComponentFixture<ManageorganizationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageorganizationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageorganizationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
