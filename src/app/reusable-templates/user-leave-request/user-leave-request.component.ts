import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgceIconModule } from '@clarium/ngce-icon';
import {
  NgceComponentsModule,
  PaginatorConfig,
} from '@clarium/ngce-components';

@Component({
  selector: 'lms-user-leave-request',
  standalone: true,
  imports: [NgceComponentsModule, NgceIconModule],
  providers: [DatePipe],
  templateUrl: './user-leave-request.component.html',
  styleUrl: './user-leave-request.component.scss',
})
export class UserLeaveRequestComponent {
  appearance: 'outlined' | 'raised' | 'none' = 'none';

  constructor(private datePipe: DatePipe) {}

  userRequestCardStyles = {
    border: ' 0px solid rgb(229, 231, 235)',
    'box-shadow': 'rgba(0, 0, 0, 0.2) 0px 0px 3px 0px',
    width: '95%',
    backgroundColor: '#fff',
    margin: '0.5rem',
  };

  userLeaveRequestData = [
    {
      leave: {
        leave_type: 'Annual',
        leave_count: 12,
        days: 5,
        start_date: '20 Mar 2025',
        end_date: '24 Mar 2025',
        description: 'Vacation trip to Kerala',
        user: {
          user_id: 1001,
          user_name: 'Rahul Sharma',
          first_name: 'Rahul',
          last_name: 'Sharma',
          days_left: 7,
        },
      },
    },
    {
      leave: {
        leave_type: 'Sick',
        leave_count: 10,
        days: 3,
        start_date: '18 Mar 2025',
        end_date: '20 Mar 2025',
        description: 'Recovering from fever',
        user: {
          user_id: 1002,
          user_name: 'Anita Singh',
          first_name: 'Anita',
          last_name: 'Singh',
          days_left: 6,
        },
      },
    },
    {
      leave: {
        leave_type: 'Maternity',
        leave_count: 180,
        days: 30,
        start_date: '15 Mar 2025',
        end_date: '14 Apr 2025',
        description: 'Maternity leave after childbirth',
        user: {
          user_id: 1003,
          user_name: 'Priya Mehta',
          first_name: 'Priya',
          last_name: 'Mehta',
          days_left: 150,
        },
      },
    },
    {
      leave: {
        leave_type: 'Casual',
        leave_count: 8,
        days: 2,
        start_date: '22 Mar 2025',
        end_date: '23 Mar 2025',
        description: 'Attending a family wedding',
        user: {
          user_id: 1004,
          user_name: 'Vikram Patel',
          first_name: 'Vikram',
          last_name: 'Patel',
          days_left: 4,
        },
      },
    },
    {
      leave: {
        leave_type: 'Annual',
        leave_count: 15,
        days: 7,
        start_date: '10 Mar 2025',
        end_date: '17 Mar 2025',
        description: 'Long weekend getaway to Goa',
        user: {
          user_id: 1005,
          user_name: 'Suresh Kumar',
          first_name: 'Suresh',
          last_name: 'Kumar',
          days_left: 8,
        },
      },
    },
    {
      leave: {
        leave_type: 'Sick',
        leave_count: 12,
        days: 2,
        start_date: '25 Mar 2025',
        end_date: '26 Mar 2025',
        description: 'Headache and body pain',
        user: {
          user_id: 1006,
          user_name: 'Neha Joshi',
          first_name: 'Neha',
          last_name: 'Joshi',
          days_left: 5,
        },
      },
    },
    {
      leave: {
        leave_type: 'Annual',
        leave_count: 20,
        days: 10,
        start_date: '01 Apr 2025',
        end_date: '10 Apr 2025',
        description: 'Family trip to the Himalayas',
        user: {
          user_id: 1007,
          user_name: 'Arvind Pandey',
          first_name: 'Arvind',
          last_name: 'Pandey',
          days_left: 12,
        },
      },
    },
    {
      leave: {
        leave_type: 'Casual',
        leave_count: 6,
        days: 1,
        start_date: '05 Apr 2025',
        end_date: '05 Apr 2025',
        description: 'Personal work',
        user: {
          user_id: 1008,
          user_name: 'Deepa Reddy',
          first_name: 'Deepa',
          last_name: 'Reddy',
          days_left: 3,
        },
      },
    },
    {
      leave: {
        leave_type: 'Sick',
        leave_count: 10,
        days: 4,
        start_date: '21 Mar 2025',
        end_date: '24 Mar 2025',
        description: 'Recovering from viral fever',
        user: {
          user_id: 1009,
          user_name: 'Mohit Sharma',
          first_name: 'Mohit',
          last_name: 'Sharma',
          days_left: 6,
        },
      },
    },
    {
      leave: {
        leave_type: 'Annual',
        leave_count: 18,
        days: 12,
        start_date: '10 Apr 2025',
        end_date: '21 Apr 2025',
        description: 'Vacation with family',
        user: {
          user_id: 1010,
          user_name: 'Shruti Deshmukh',
          first_name: 'Shruti',
          last_name: 'Deshmukh',
          days_left: 6,
        },
      },
    },
    {
      leave: {
        leave_type: 'Sick',
        leave_count: 15,
        days: 5,
        start_date: '17 Mar 2025',
        end_date: '21 Mar 2025',
        description: 'Severe cold and cough',
        user: {
          user_id: 1011,
          user_name: 'Akash Patil',
          first_name: 'Akash',
          last_name: 'Patil',
          days_left: 10,
        },
      },
    },
    {
      leave: {
        leave_type: 'Casual',
        leave_count: 5,
        days: 3,
        start_date: '28 Mar 2025',
        end_date: '30 Mar 2025',
        description: 'Taking care of personal matters',
        user: {
          user_id: 1012,
          user_name: 'Ravi Gupta',
          first_name: 'Ravi',
          last_name: 'Gupta',
          days_left: 2,
        },
      },
    },
    {
      leave: {
        leave_type: 'Annual',
        leave_count: 25,
        days: 15,
        start_date: '05 Apr 2025',
        end_date: '19 Apr 2025',
        description: 'Summer holiday with family',
        user: {
          user_id: 1013,
          user_name: 'Komal Thakur',
          first_name: 'Komal',
          last_name: 'Thakur',
          days_left: 10,
        },
      },
    },
    {
      leave: {
        leave_type: 'Maternity',
        leave_count: 180,
        days: 60,
        start_date: '01 Mar 2025',
        end_date: '30 Apr 2025',
        description: 'Maternity leave after childbirth',
        user: {
          user_id: 1014,
          user_name: 'Neha Malik',
          first_name: 'Neha',
          last_name: 'Malik',
          days_left: 120,
        },
      },
    },
    {
      leave: {
        leave_type: 'Sick',
        leave_count: 10,
        days: 1,
        start_date: '15 Mar 2025',
        end_date: '15 Mar 2025',
        description: 'Stomach infection',
        user: {
          user_id: 1015,
          user_name: 'Pradeep Kumawat',
          first_name: 'Pradeep',
          last_name: 'Kumawat',
          days_left: 3,
        },
      },
    },
  ];

  paginatorConfig: PaginatorConfig = {
    totalRecords: this.userLeaveRequestData.length,
    rowsPerPageOptions: [2, 4, 6, 10],
    // paginatorType: 'circle',
  };
}
