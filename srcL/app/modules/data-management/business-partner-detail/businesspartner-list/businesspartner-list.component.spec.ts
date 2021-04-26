import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinesspartnerListComponent } from './businesspartner-list.component';

describe('BusinesspartnerListComponent', () => {
  let component: BusinesspartnerListComponent;
  let fixture: ComponentFixture<BusinesspartnerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinesspartnerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinesspartnerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
