import { Injectable } from '@angular/core';
import { traceUntilFirst } from '@angular/fire/performance';
import {
  Auth,
  authState,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';
import {
  doc,
  docData,
  DocumentReference,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { User } from '../shared/model/user';
import { Router } from '@angular/router';
// import { User } from '../shared/model/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user$?: Observable<User | null>;
  uid?: string | undefined;
  doc?: DocumentReference;
  provider = new GoogleAuthProvider();
  title: string = 'AngularFirebase';

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    if (auth) {
      authState(this.auth).subscribe((state) => {
        if (state) {
          this.uid = state.uid;
          this.user$ = this.getUserData(state.uid);
        } else {
          this.user$ = of(null);
        }
      });
    }
  }

  async googleSignIn() {
    return signInWithPopup(this.auth, this.provider)
      .then(async (result: any) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;

        this.getUserData(user.uid).subscribe(async (userData) => {
          if (!userData) {
            await this.updateUserData(user);
            console.log('user data added...');
          }
        });
        this.router.navigate([user.uid]);
      })
      .catch((error: any) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  private async updateUserData(user: User) {
    // Sets user data to firestore on login
    const docRef = doc(this.firestore, `users/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };

    return await setDoc(docRef, data, { merge: true });
  }

  private getUserData(uid: string) {
    const docRef = doc(this.firestore, `users/${uid}`);

    return docData(docRef).pipe(traceUntilFirst('firestore'));
  }

  async logout() {
    console.log('logged out');
    if (confirm('Are you sure you want to logout?')) {
      return await signOut(this.auth)
        .then(() => {
          window.location.reload();
          // this.router.navigate(['/']);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      return;
    }
  }
}
