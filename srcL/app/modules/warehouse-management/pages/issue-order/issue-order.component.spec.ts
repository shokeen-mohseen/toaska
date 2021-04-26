import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueOrderComponent } from './issue-order.component';

describe('IssueOrderComponent', () => {
  let component: IssueOrderComponent;
  let fixture: ComponentFixture<IssueOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
