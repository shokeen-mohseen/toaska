import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartographSetupComponent } from './partograph-setup.component';

describe('PartographSetupComponent', () => {
  let component: PartographSetupComponent;
  let fixture: ComponentFixture<PartographSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartographSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartographSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
