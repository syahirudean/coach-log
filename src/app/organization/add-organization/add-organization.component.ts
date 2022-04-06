import { Component, OnInit } from '@angular/core';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-add-organization',
  templateUrl: './add-organization.component.html',
  styleUrls: ['./add-organization.component.scss'],
})
export class AddOrganizationComponent implements OnInit {
  organizationForm?: FormGroup;

  // Form state
  loading = false;
  success = false;

  constructor(
    private firestore: Firestore,
    private fb: FormBuilder,
    private user_service: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.organizationForm = this.fb.group({
      img_url: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
    });
  }

  get img_url() {
    return this.organizationForm?.get('img_url');
  }

  get name() {
    return this.organizationForm?.get('name');
  }

  get description() {
    return this.organizationForm?.get('description');
  }

  async submitHandler() {
    this.loading = true;

    const formValue = this.organizationForm?.value;
    const setId = formValue.name.toLowerCase().replace(/\s/g, '-');

    await setDoc(
      doc(
        this.firestore,
        `users/${this.user_service.uid}/organizations`,
        setId
      ),
      {
        id: setId,
        img_url: formValue.img_url,
        name: formValue.name,
        description: formValue.description,
        tags: [],
        total_hours: 0,
        total_sessions: 0,
        total_earnings: 0,
      }
    )
      .then(async () => {
        console.log('success');
        alert('successfully added a new client...');
        this.router.navigate([this.user_service.uid]);
      })
      .catch((err) => {
        console.log(err);
        alert(
          'Oh-oh, something when wrong. Try again later or contact support.'
        );
      });
  }
}
