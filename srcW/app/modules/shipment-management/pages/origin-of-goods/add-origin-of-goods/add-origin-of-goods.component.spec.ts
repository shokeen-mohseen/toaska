import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOriginOfGoodsComponent } from './add-origin-of-goods.component';

describe('AddOriginOfGoodsComponent', () => {
  let component: AddOriginOfGoodsComponent;
  let fixture: ComponentFixture<AddOriginOfGoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOriginOfGoodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOriginOfGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
