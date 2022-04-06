import { Component, OnInit } from '@angular/core';
import {
  collection,
  doc,
  docData,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarOptions, GoogleCalendar } from 'datebook';
import { addDoc, writeBatch } from 'firebase/firestore';
import { Organization } from 'src/app/shared/model/organization';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-add-session',
  templateUrl: './add-session.component.html',
  styleUrls: ['./add-session.component.scss'],
})
export class AddSessionComponent implements OnInit {
  organization_id = this.route.snapshot.paramMap.get('id');
  organizationRef: any;
  organization?: Organization;
  recurrence: any = {
    status: 'No',
  };

  // array of numbers 0-23
  hours: number[] = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23,
  ];

  minutes: number[] = [0, 15, 30, 45];

  occurrences: number[] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];

  sessionForm?: FormGroup;

  // Form state
  loading = false;
  success = false;

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private route: ActivatedRoute,
    public user: UserService,
    private router: Router
  ) {
    this.organizationRef = doc(
      this.firestore,
      `users/${this.user.uid}/organizations/${this.organization_id}`
    );

    docData<Organization>(this.organizationRef).subscribe((organization) => {
      this.organization = organization;
    });
  }

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

    formValue.count = parseInt(formValue.count);
    formValue.start_hh = parseInt(formValue.start_hh);
    formValue.start_mm = parseInt(formValue.start_mm);
    formValue.end_hh = parseInt(formValue.end_hh);
    formValue.end_mm = parseInt(formValue.end_mm);

    // GET TOTAL HOURS
    let start_mm_hh = formValue.start_mm / 60;
    let end_mm_hh = formValue.end_mm / 60;

    const start_hours: number = formValue.start_hh + start_mm_hh;
    const end_hours: number = formValue.end_hh + end_mm_hh;

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

    // Ask user if they want to add to google calendar
    if (confirm('Add to Google Calendar?')) {
      const googleCalendar = new GoogleCalendar(date_book_config);
      window.open(googleCalendar.render());
    }

    // SUBMIT DATA TO DATABASE
    try {
      // Add session to database
      await this.addSessionData(start_time, end_time);
      // Add total earnings, hours, & sessions to database
      await this.addTotalData();
      this.success = true;
      console.log('success');
    } catch (error) {
      console.log(error);
    }
    return this.router.navigate([this.user.uid, this.organization_id]);
  }

  async addSessionData(start_time: string, end_time: string) {
    const formValue = this.sessionForm?.value;

    // CREATE SESSION ARRAY
    let session_array = [];
    for (let i = 0; i < formValue.count; i++) {
      let week_date = new Date(formValue.date).getTime() + 8.64e7 * 7 * i;

      // Create session object
      const session_data = {
        title: formValue.title,
        amount: formValue.amount,
        date: week_date,
        start_time: start_time,
        end_time: end_time,
        hours: formValue.hours,
      };

      // Add session to array
      session_array.push(session_data);
    }

    const batch = writeBatch(this.firestore);

    // ADD SESSION_ARRAY TO DATABASE
    session_array.forEach((session) => {
      const sessionRef = collection(
        this.firestore,
        `users/${this.user.uid}/organizations/${this.organization_id}/sessions`
      );

      batch.set(doc(sessionRef), session);
    });

    return await batch
      .commit()
      .then(() => {
        console.log('session successfully added');
      })
      .catch((err) => {
        console.error(err);
        alert('Oopps, something went wrong. Please try again later.');
      });
  }

  async addTotalData() {
    const formValue = this.sessionForm?.value;

    // Create total object
    const total_data: Organization = {
      total_hours:
        formValue.hours * formValue.count + this.organization?.total_hours!,
      total_earnings:
        formValue.amount * formValue.hours * formValue.count +
        this.organization?.total_earnings!,
      total_sessions: formValue.count + this.organization?.total_sessions,
      tags: [formValue.title],
    };

    if (this.organization?.tags?.length) {
      total_data.tags = [...this.organization.tags, formValue.title];
    }

    return await updateDoc(this.organizationRef, total_data)
      .then(() => {
        console.log('organization data successfully added');
      })
      .catch((err) => {
        console.error(err);
        alert('Oops, something went wrong. Please try again later.');
      });
  }
}
