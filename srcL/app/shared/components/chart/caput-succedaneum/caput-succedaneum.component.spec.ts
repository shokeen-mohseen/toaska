import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaputSuccedaneumComponent } from './caput-succedaneum.component';

describe('CaputSuccedaneumComponent', () => {
  let component: CaputSuccedaneumComponent;
  let fixture: ComponentFixture<CaputSuccedaneumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaputSuccedaneumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaputSuccedaneumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
