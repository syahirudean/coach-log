import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'any' })
export class ModalService {
  private modals: any[] = [];

  // MODAL STYLING SERVICE
  private modalStyle = new BehaviorSubject('');
  currentModalStyle = this.modalStyle.asObservable();

  add(modal: any) {
    // add modal to array of active modals
    this.modals.push(modal);
  }

  remove(id: string) {
    // remove modal from array of active modals
    this.modals = this.modals.filter((x) => x.id !== id);
  }

  open(id: string) {
    // open modal specified by id
    const modal = this.modals.find((x) => x.id === id);
    modal.open();
  }

  close(id: string) {
    // close modal specified by id
    const modal = this.modals.find((x) => x.id === id);
    modal.close();
  }

  add_styling(_style: string) {
    this.modalStyle.next(_style);
  }
}
