import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowOrderFilterComponent } from './show-order-filter.component';

describe('ShowOrderFilterComponent', () => {
  let component: ShowOrderFilterComponent;
  let fixture: ComponentFixture<ShowOrderFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowOrderFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowOrderFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
