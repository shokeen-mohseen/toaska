import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManageorganizationComponent } from './add-manageorganization.component';

describe('AddManageorganizationComponent', () => {
  let component: AddManageorganizationComponent;
  let fixture: ComponentFixture<AddManageorganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddManageorganizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddManageorganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
