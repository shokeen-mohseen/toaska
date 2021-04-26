import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPartographComponent } from './new-partograph.component';

describe('NewPartographComponent', () => {
  let component: NewPartographComponent;
  let fixture: ComponentFixture<NewPartographComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPartographComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPartographComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
