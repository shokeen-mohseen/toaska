import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcinventoryLavelListComponent } from './dcinventory-lavel-list.component';

describe('DcinventoryLavelListComponent', () => {
  let component: DcinventoryLavelListComponent;
  let fixture: ComponentFixture<DcinventoryLavelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcinventoryLavelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcinventoryLavelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
