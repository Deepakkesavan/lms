import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { NgceComponentsModule } from '@clarium/ngce-components';
import { NgceIconModule } from '@clarium/ngce-icon';
import { approvalStatusKeys } from '../../shared/literal-types/literal-types';
import { CapitalizePipe } from '../../shared/pipes/capitalize.pipe';

@Component({
  selector: 'lms-status',
  standalone: true,
  imports: [NgceComponentsModule, NgceIconModule, CommonModule, CapitalizePipe],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss',
})
export class StatusComponent {
  status = input<string>(approvalStatusKeys.APPROVED);
  approved = approvalStatusKeys.APPROVED;
  rejected = approvalStatusKeys.REJECTED;
  cancelled = approvalStatusKeys.CANCELLED;
  pending = approvalStatusKeys.PENDING;
  draft = approvalStatusKeys.Drafted;

  getStatusClassName() {
    switch (this.status().toLowerCase()) {
      case this.approved:
        return 'st-completed';
      case this.rejected:
        return 'st-rejected';
      case this.pending:
        return 'st-pending';
      case this.cancelled:
        return 'st-cancelled';
      case this.draft:
        return 'st-drafted';
      default:
        return 'st-pending';
    }
  }
}
