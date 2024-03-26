import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  @Input() form: FormGroup = new FormGroup({});
  @Input() buttonText: string = 'Submit';
  @Output() submit = new EventEmitter();
  @Output() backEvent = new EventEmitter();

  constructor(
    // private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  submitForm() {
    this.submit.emit();
  }

  back(){
    this.backEvent.emit();
    this.router.navigate(['..'], {relativeTo: this.route});
  }
}
