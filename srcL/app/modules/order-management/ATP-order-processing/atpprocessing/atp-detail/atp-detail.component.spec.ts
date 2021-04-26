import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtpDetailComponent } from './atp-detail.component';

describe('AtpDetailComponent', () => {
  let component: AtpDetailComponent;
  let fixture: ComponentFixture<AtpDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtpDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtpDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
