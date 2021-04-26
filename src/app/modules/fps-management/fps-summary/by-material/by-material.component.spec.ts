import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ByMaterialComponent } from './by-material.component';

describe('ByMaterialComponent', () => {
  let component: ByMaterialComponent;
  let fixture: ComponentFixture<ByMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ByMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ByMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
