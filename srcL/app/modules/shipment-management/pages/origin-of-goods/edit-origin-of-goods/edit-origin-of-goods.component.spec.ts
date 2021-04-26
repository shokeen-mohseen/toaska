import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOriginOfGoodsComponent } from './edit-origin-of-goods.component';

describe('EditOriginOfGoodsComponent', () => {
  let component: EditOriginOfGoodsComponent;
  let fixture: ComponentFixture<EditOriginOfGoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOriginOfGoodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOriginOfGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
