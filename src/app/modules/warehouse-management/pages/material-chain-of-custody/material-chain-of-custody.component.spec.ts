import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialChainOfCustodyComponent } from './material-chain-of-custody.component';

describe('MaterialChainOfCustodyComponent', () => {
  let component: MaterialChainOfCustodyComponent;
  let fixture: ComponentFixture<MaterialChainOfCustodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialChainOfCustodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialChainOfCustodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
