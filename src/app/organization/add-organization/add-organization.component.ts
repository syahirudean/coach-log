import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {}

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

    console.log(formValue)
  }

}
