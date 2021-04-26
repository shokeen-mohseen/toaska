import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtpOrderFilterComponent } from './atp-order-filter.component';

describe('AtpOrderFilterComponent', () => {
  let component: AtpOrderFilterComponent;
  let fixture: ComponentFixture<AtpOrderFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtpOrderFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtpOrderFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
