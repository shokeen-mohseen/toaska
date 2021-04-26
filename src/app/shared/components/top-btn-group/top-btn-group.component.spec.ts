import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBtnGroupComponent } from './top-btn-group.component';

describe('TopBtnGroupComponent', () => {
  let component: TopBtnGroupComponent;
  let fixture: ComponentFixture<TopBtnGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopBtnGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBtnGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
