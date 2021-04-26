import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateTagsListComponent } from './generate-tags-list.component';

describe('GenerateTagsListComponent', () => {
  let component: GenerateTagsListComponent;
  let fixture: ComponentFixture<GenerateTagsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateTagsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateTagsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
