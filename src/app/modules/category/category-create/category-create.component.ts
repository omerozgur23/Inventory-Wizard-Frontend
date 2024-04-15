// import { Component } from '@angular/core';
// import { FormBuilder } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';
// import { CategoryService } from '../service/category.service';
// import { ActivatedRoute, Router } from '@angular/router';

// @Component({
//   selector: 'app-category-create',
//   templateUrl: './category-create.component.html',
//   styleUrl: './category-create.component.scss'
// })
// export class CategoryCreateComponent {
//   categoryForm = this.fb.group({
//     categoryName: ''
//   });

//   constructor(
//     private fb: FormBuilder,
//     private toastr: ToastrService,
//     private categoryService: CategoryService,
//     private router: Router,
//     private route: ActivatedRoute,
//   ) {}

//   submit(){
//     // this.categoryService.createCategory(this.categoryForm.value).subscribe({
//     //   next: (resp) => {
//     //     this.toastr.success('Kategori Oluşturulmuştur');
//     //     this.router.navigate(['..'], {relativeTo: this.route});
//     //   },
//     //   error: (err) => {
//     //     console.log(err);
//     //     this.toastr.error("Hata oluştu");
//     //   }
//     // })
//   }
// }
