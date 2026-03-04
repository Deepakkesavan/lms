import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  input,
  effect,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { NgceComponentsModule } from '@clarium/ngce-components';
import { ICatalog } from 'app/shared/models/common';

@Component({
  selector: 'lms-apply-leave-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NgceComponentsModule,
  ],
  templateUrl: './apply-leave-form.component.html',
  styleUrl: './apply-leave-form.component.scss',
})
export class ApplyLeaveFormComponent implements OnInit {
  /* ---------- INPUTS ---------- */
  leaveTypes = input<ICatalog[]>([]);
  initialValue = input<any>();
  @Input() disableSubmit = false; // optional (popup control)
  viewOnly = input<boolean>(false);
  showLeaveDayType = input<boolean>(true);

  /* ---------- OUTPUTS ---------- */
  @Output() saveDraft = new EventEmitter<any>();
  @Output() submit = new EventEmitter<FormGroup>();
  @Output() formValueChange = new EventEmitter<any>();
  @Output() leaveDaysChange = new EventEmitter<number>();

  leaveForm!: FormGroup;
  requestedLeaveDays = 0;

  dayTypes = [
    { key: 'FULL_DAY', value: 'Full Day' },
    { key: 'HALF_DAY', value: 'Half Day' },
  ];

  constructor(private fb: FormBuilder) {
    effect(() => {
      if (this.viewOnly()) {
        this.leaveForm.disable();
      }
    });

    effect(() => {
      if (!this.showLeaveDayType()) {
        this.leaveForm.patchValue(
          { leaveDayTypeValue: 'FULL_DAY' },
          { emitEvent: false }
        );
      }
    });

    effect(() => {
      if (this.initialValue()) {
        this.leaveForm.patchValue({
          startDate: this.initialValue().startDate?.split('T')[0],
          endDate: this.initialValue().endDate?.split('T')[0],
          leaveTypeValue: this.getLeaveTypeValue(
            this.initialValue().leaveTypeKey
          ),
          leaveDayTypeValue: this.initialValue().isHalfDay
            ? 'HALF_DAY'
            : 'FULL_DAY',
          reason: this.initialValue().reason,
        });
      }
    });
  }

  getLeaveTypeValue(key: string): string {
    return this.leaveTypes().find((i: ICatalog) => i.key === key)?.value ?? '';
  }

  private toDateInputValue(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.leaveForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      leaveTypeValue: ['', Validators.required],
      leaveDayTypeValue: ['', Validators.required],
      reason: [''],
    });

    if (this.initialValue()) {
      this.leaveForm.patchValue(this.initialValue());
    }

    this.leaveForm.valueChanges.subscribe((value) => {
      this.handleHalfDayLogic(value);
      this.calculateLeaveDays(value);

      this.formValueChange.emit({
        value,
        isValid: this.leaveForm.valid,
      });
    });
  }

  private handleHalfDayLogic(value: any) {
    if (value.type === 'HALF_DAY' && value.startDate) {
      this.leaveForm.patchValue(
        { endDate: value.startDate },
        { emitEvent: false }
      );
      this.leaveForm.get('endDate')?.disable({ emitEvent: false });
    } else {
      this.leaveForm.get('endDate')?.enable({ emitEvent: false });
    }
  }

  private calculateLeaveDays(value: any) {
    if (!value.startDate || !value.endDate) return;

    this.requestedLeaveDays =
      value.type === 'HALF_DAY'
        ? 0.5
        : Math.floor(
            (new Date(value.endDate).getTime() -
              new Date(value.startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          ) + 1;

    this.leaveDaysChange.emit(this.requestedLeaveDays);
  }

  /* ---------- BUTTON ACTIONS ---------- */
  onSaveDraft() {
    this.saveDraft.emit(this.leaveForm.getRawValue());
  }

  onSubmit() {
    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      return;
    }
    this.submit.emit(this.leaveForm.getRawValue());
  }
}
