import { Component } from '@angular/core';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
})
export class OrganizationComponent {
  organizations = [
    {
      title: 'U12',
      date: '	2022-03-23T10:34:07Z',
      start: '09:00',
      end: '10:00',
      hours: 2,
      amount: 65,
    },
    {
      title: 'U14',
      date: '	2022-03-23T10:34:07Z',
      start: '10:00',
      end: '11:00',
      hours: 2,
      amount: 70,
    },
  ];
}
