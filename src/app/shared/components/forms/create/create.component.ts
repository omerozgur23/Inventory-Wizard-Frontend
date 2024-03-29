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
  @Output() submitForm = new EventEmitter();
  @Output() backEvent = new EventEmitter();
  @Input() fieldLabels: {[key: string]: string} = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  submit() {
    this.submitForm.emit();
  }

  back(){
    this.backEvent.emit();
    this.router.navigate(['..'], {relativeTo: this.route});
  }

  getLabel(key: string): string {
    return this.fieldLabels[key] || key;
  }
}
