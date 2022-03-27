import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CalendarOptions,
  GoogleCalendar,
  ICalendar,
  OutlookCalendar,
  YahooCalendar,
} from 'datebook';

@Component({
  selector: 'app-add-session',
  templateUrl: './add-session.component.html',
  styleUrls: ['./add-session.component.scss'],
})
export class AddSessionComponent implements OnInit {
  recurrence: any = {
    status: 'No',
  };

  // array of numbers 0-23
  hours = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23,
  ];

  minutes = [0, 15, 30, 45];

  occurrences = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];

  sessionForm?: FormGroup;

  // Form state
  loading = false;
  success = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.sessionForm = this.fb.group({
      title: ['', Validators.required],
      amount: [
        null,
        [Validators.required, Validators.min(1), Validators.max(999)],
      ],
      date: [
        new Date(Date.now()).toISOString().split('T')[0],
        Validators.required,
      ],
      start_hh: [0, Validators.required],
      start_mm: [0, Validators.required],
      end_hh: [0, Validators.required],
      end_mm: [0, Validators.required],
      hours: [0],
      count: [1],
    });
  }

  get title() {
    return this.sessionForm?.get('title');
  }

  get amount() {
    return this.sessionForm?.get('amount');
  }

  get date() {
    return this.sessionForm?.get('date');
  }

  get start_hh() {
    return this.sessionForm?.get('start_hh');
  }

  get start_mm() {
    return this.sessionForm?.get('start_mm');
  }

  get end_hh() {
    return this.sessionForm?.get('end_hh');
  }

  get end_mm() {
    return this.sessionForm?.get('end_mm');
  }

  get count() {
    return this.sessionForm?.get('count');
  }

  async submitHandler() {
    this.loading = true;

    const formValue = this.sessionForm?.value;

    let start_hh_num = parseInt(formValue.start_hh);
    let start_mm_num = parseInt(formValue.start_mm);
    let end_hh_num = parseInt(formValue.end_hh);
    let end_mm_num = parseInt(formValue.end_mm);

    // GET TOTAL HOURS
    let start_mm_hh = start_mm_num / 60;
    let end_mm_hh = end_mm_num / 60;

    const start_hours: number = start_hh_num + start_mm_hh;
    const end_hours: number = end_hh_num + end_mm_hh;

    formValue.hours = end_hours - start_hours;

    // CONVERT TIME TO STRING
    const start_time = `${formValue.start_hh
      .toString()
      .padStart(2, '0')}:${formValue.start_mm.toString().padStart(2, '0')}`;
    const end_time = `${formValue.end_hh
      .toString()
      .padStart(2, '0')}:${formValue.end_mm.toString().padStart(2, '0')}`;

    // SET DATEBOOK CALENDAR
    const start_date = new Date(formValue.date + 'T' + start_time);
    const end_date = new Date(formValue.date + 'T' + end_time);

    const date_book_config: CalendarOptions = {
      title: formValue.title,
      description: `Rate: $${formValue.amount}/hr`,
      start: new Date(start_date),
      end: new Date(end_date),
      recurrence: {
        frequency: 'WEEKLY',
        interval: 1,
        count: formValue.count,
      },
    };

    // TODO: Ask user if they want to add to google calendar
    if (confirm('Add to Google Calendar?')) {
      const googleCalendar = new GoogleCalendar(date_book_config);
      window.open(googleCalendar.render());
    }

    // CREATE SESSION OBJECTS FOR DATABASE
    let session_array = [];
    for (let i = 0; i < formValue.count; i++) {
      let week_date = new Date(formValue.date).getTime() + 8.64e7 * 7 * i;

      const session_data = {
        title: formValue.title,
        amount: formValue.amount,
        date: new Date(week_date).toISOString().split('T')[0],
        start_time: start_time,
        end_time: end_time,
        hours: formValue.hours,
      };

      session_array.push(session_data);
    }

    console.log(session_array);

    this.loading = false;
  }
}
