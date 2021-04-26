import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DasboardLayoutComponent } from './dasboard-layout.component';

describe('DasboardLayoutComponent', () => {
  let component: DasboardLayoutComponent;
  let fixture: ComponentFixture<DasboardLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DasboardLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DasboardLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
