import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindPartographComponent } from './find-partograph.component';

describe('FindPartographComponent', () => {
  let component: FindPartographComponent;
  let fixture: ComponentFixture<FindPartographComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindPartographComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindPartographComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
