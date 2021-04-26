import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepartumCareComponent } from './prepartum-care.component';

describe('PrepartumCareComponent', () => {
  let component: PrepartumCareComponent;
  let fixture: ComponentFixture<PrepartumCareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepartumCareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepartumCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
