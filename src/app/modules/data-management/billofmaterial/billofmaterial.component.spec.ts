import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillofmaterialComponent } from './billofmaterial.component';

describe('BillofmaterialComponent', () => {
  let component: BillofmaterialComponent;
  let fixture: ComponentFixture<BillofmaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillofmaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillofmaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
