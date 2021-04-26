import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArcpartographComponent } from './arcpartograph.component';

describe('ArcpartographComponent', () => {
  let component: ArcpartographComponent;
  let fixture: ComponentFixture<ArcpartographComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArcpartographComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArcpartographComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
