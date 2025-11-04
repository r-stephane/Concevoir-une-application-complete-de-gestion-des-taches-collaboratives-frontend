import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateProjectModalComponent } from './create-project-modal.component';

describe('CreateProjectModalComponent', () => {
  let component: CreateProjectModalComponent;
  let fixture: ComponentFixture<CreateProjectModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CreateProjectModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProjectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
