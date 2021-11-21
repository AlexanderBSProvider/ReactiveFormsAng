import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import { EmailService } from '../email.service';
import {Observable} from "rxjs";


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  providers: [
    EmailService
  ]
})
export class FormComponent implements OnInit {

  ngOnInit(): void {
    this.myForm.controls['userTechnology'].valueChanges.subscribe(()=> {
      this.myForm.controls['userVersion'].enable();
    })
  }

  constructor (private emailService: EmailService, private formBuilder: FormBuilder) {
  }

  technologies = ['angular', 'react', 'vue'];
  versions = {
    "angular": ['1.1.1', '1.2.1', '1.3.3'],
    "react": ['2.1.2', '3.2.4', '4.3.1'],
    "vue": ['3.3.1', '5.2.1', '5.1.3']
  }

  myForm: FormGroup = this.formBuilder.group ({

    "userName": ["", Validators.required],
    "userSurname": ["", Validators.required],
    "userEmail": ['', [Validators.required, Validators.email], [this.emailAsyncValidator.bind(this)]],
    "userDate": ["", Validators.required],
    "userTechnology": ["", Validators.required],
    "userVersion": [{value: "", disabled: true}, Validators.required],
    "userPhone": ["", Validators.pattern("[0-9]{10}")],
    "userHobbies": new FormArray([
      new FormControl("", Validators.required)
    ])
  });

  // userEmailValidator(control: FormControl): { [s: string]: boolean } | null {
  //
  //     if (control.value === "test@test.test") {
  //       return {"userEmail": true};
  //     }
  //     return null;
  // }

  emailAsyncValidator(control: FormControl): Observable<ValidationErrors> {
    return this.emailService.validateEmail(control.value);
  }

  getFormsControls() : FormArray{
    return this.myForm.controls['userHobbies'] as FormArray;
  }

  addHobbies(){
    (<FormArray>this.myForm.controls["userHobbies"]).push(new FormControl("", Validators.required));
  }

  getVersion(tech: string) {
    for (let [key,value] of Object.entries(this.versions)){
      if (tech == key) {
        return value;
      }
    }
    return [];
  }

  isUserNameExisted() {
    return this.myForm.controls['userEmail'].getError('nameError');
  }

  submit () {
    console.log(this.myForm.value);
  }

}
