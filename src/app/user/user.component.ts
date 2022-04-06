import { Component } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs/internal/Observable';
import { Organization } from '../shared/model/organization';
import { UserService } from './user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  organizations$?: Observable<Organization[]>;
  constructor(private firestore: Firestore, public uid: UserService) {
    const ref = collection(firestore, `users/${this.uid.uid}/organizations`);
    this.organizations$ = collectionData(ref, { idField: 'id' });
  }
}
