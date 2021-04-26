import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionFilterComponent } from './production-filter.component';

describe('ProductionFilterComponent', () => {
  let component: ProductionFilterComponent;
  let fixture: ComponentFixture<ProductionFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
