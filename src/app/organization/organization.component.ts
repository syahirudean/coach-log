import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  docData,
  Firestore,
  limit,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { onSnapshot } from 'firebase/firestore';
import { Observable } from 'rxjs/internal/Observable';
import { Session } from '../shared/model/session';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
})
export class OrganizationComponent {
  @ViewChild('closeModal') closeModal: ElementRef | undefined;
  organization$?: Observable<any>;
  colRef: any;
  sessions?: Session[] = [];
  tags?: string[] = [];
  organization_id = this.route.snapshot.paramMap.get('id');
  filter: string = '⭐️';
  start_date?: string = new Date(Date.now()).toISOString().split('T')[0];
  min_date?: string;
  end_date?: string = new Date(Date.now()).toISOString().split('T')[0];
  max_date?: string;
  current_hours = 0;
  current_earnings = 0;
  q: any;

  modal_data = {
    title: '',
    id: '',
    date: '',
  };

  constructor(
    private route: ActivatedRoute,
    public userId: UserService,
    private router: Router,
    private db: Firestore
  ) {
    // Get organization
    const docRef = doc(
      this.db,
      `users/${this.userId.uid}/organizations/${this.organization_id}`
    );
    this.organization$ = docData(docRef);

    // Get all sessions for this organization
    this.colRef = collection(
      db,
      `users/${this.userId.uid}/organizations/${this.organization_id}/sessions`
    );
    this.getCollection(true);
  }

  goTo(str: string) {
    this.router.navigate([str]);
  }

  async getTagCollection(str: string) {
    (this.q = query(
      this.colRef,
      orderBy('date', 'asc'),
      where('title', '==', str)
    )),
      limit(5);
  }

  async getCollection(state: boolean = false) {
    if (state) {
      this.q = query(this.colRef, orderBy('date', 'asc'));
    } else {
      if (this.filter === '⭐️') {
        this.q = query(
          this.colRef,
          orderBy('date', 'asc'),
          where('date', '>=', new Date(this.start_date!).getTime()),
          where('date', '<=', new Date(this.end_date!).getTime())
        );
        // where('date', '>=', new Date(Date.now()).getTime())
        // TODO: Add limit
        // limit(5)
      } else {
        this.q = query(
          this.colRef,
          orderBy('date', 'asc'),
          where('title', '==', this.filter),
          where('date', '>=', new Date(this.start_date!).getTime()),
          where('date', '<=', new Date(this.end_date!).getTime())
        );
        // TODO: Add limit
        // limit(5)
      }
    }
    this.snapShot(this.q, state);
  }

  async snapShot(q: any, state: boolean) {
    onSnapshot(q, (snapshot: any) => {
      const datas: Session[] = [];
      snapshot.docs.forEach((doc: any) => {
        datas?.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      if (datas!.length > 0 && state) {
        this.start_date = new Date(datas![0].date!).toISOString().split('T')[0];
        this.min_date = this.start_date;
        this.end_date = new Date(datas![datas!.length - 1].date!)
          .toISOString()
          .split('T')[0];
        this.max_date = this.end_date;
      }
      this.current_earnings = datas.reduce(
        (acc: number, cur: any) => acc + cur.amount * cur.hours,
        0
      );
      this.current_hours = datas.reduce(
        (acc: number, cur: any) => acc + cur.hours,
        0
      );
      this.sessions = datas;
      this.getTags(datas, this.tags);
    });
  }

  openModal(id: string, title: string, date: string) {
    this.modal_data.title = title;
    this.modal_data.id = id;
    this.modal_data.date = date;
  }

  async deleteSession(id: string) {
    try {
      await deleteDoc(
        doc(
          this.db,
          `users/${this.userId.uid}/organizations/${this.organization_id}/sessions/${id}`
        )
      );
      this.closeModal?.nativeElement.click();
      return alert('✅ Session has been successfully deleted');
    } catch (error) {
      this.closeModal?.nativeElement.click();
      console.log(error);
      this.closeModal?.nativeElement.click();
      return alert('❌ Session could not be deleted, please try again later');
    }
  }

  // get titles from sessions and push to tags array while removing duplicates
  getTags(sessions: Session[] | undefined, tags: string[] | undefined) {
    if (sessions) {
      sessions.forEach((session: Session) => {
        if (tags) {
          if (!tags.includes(session.title!)) {
            tags.push(session.title!);
          }
        } else {
          tags = [session.title!];
        }
      });
    }
    return tags;
  }
}
