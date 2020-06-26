import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { DishService } from '../services/dish.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { stringify } from 'querystring';
import { templateJitUrl } from '@angular/compiler';






@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  @ViewChild('cform') commentFormDirective;
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  temp: any;
  errMes: string;
  dishcopy: Dish;


  formErrors = {
    name: '',
    author: '',
    comment: ''
  };

  validationMessages = {

    'comment': {
      'required':      'Comment is required.'
    },
    'author': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.',
      'maxlength':     'Name cannot be more than 25 characters long.'
    },
  };

  commentForm: FormGroup;

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL
    ) { 
      this.createForm();
    }

  ngOnInit() {
    
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params
      .pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); },
    errMes => this.errMes = <any>errMes);
   
  }
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }
  
  createForm(): void{
    this.commentForm = this.fb.group({
      comment: ['', Validators.required],
      rating: 5,
      author: ['', [Validators.required, Validators.minLength(2)] ],
      date: ''

    });
    this.commentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onSubmit(){
    console.log(this.commentForm.value);
    
    this.temp = this.commentForm.value;
    this.temp.date=new Date();

    this.dishcopy.comments.push(this.temp);
    this.dishservice.putDish(this.dishcopy)
    .subscribe(dish => {
      this.dish = dish; this.dishcopy = dish;
    },
    errMes => { this.dish = null; this.dishcopy = null; this.errMes = <any>errMes; });

    this.commentForm.reset({
      author: '',
      rating: 5,
      comment: ''
    });
    this.commentFormDirective.resetForm();
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

}
