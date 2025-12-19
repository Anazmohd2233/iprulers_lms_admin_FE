import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BreadcrumbItem } from "src/app/shared/page-title/page-title.model";

// data
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { FormArray, FormBuilder, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { CourseService } from "src/app/core/service/course/course.service";
import { Course } from "src/app/apps/models/course";
import { CategoryService } from "src/app/core/service/category/category.service";
import { ToastUtilService } from "src/app/apps/toaster/toasterUtilService";

@Component({
  selector: "app-courses",
  templateUrl: "./courses.component.html",
  styleUrls: ["./courses.component.scss"],
})
export class CoursesComponent implements OnInit {
  addCourseForm!: FormGroup;

  courses: Course[] = [];
  page: number = 1;
  totalCount: number = 0;
  limit: number = 0;
  startIndex: number = 0;
  endIndex: number = 0;
  files: File | null = null; // Single file object
  category: any[] = [];
  modalRef!: NgbModalRef;
  isSubmitting: boolean = false;


  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private router: Router,
    private courseService: CourseService,
    private categoryService: CategoryService,
    private toaster: ToastUtilService
  ) {}

  ngOnInit(): void {
    this.getCourse();

    this.addCourseForm = this.fb.group({
      course_title: ["", Validators.required],
      card_title: ["", Validators.required],
      category: ["", Validators.required],
    });
    this.getCategory();
  }

  /**
   * fetches order list
   */
  private getCourse(): void {
    this.courseService.getCourses(this.page).subscribe({
      next: (response) => {
        if (response.success) {
          this.courses = response.data.courses;
          this.totalCount = Number(response.data.total_count) || 0;
          this.limit = Number(response.data.limit) || 0;
          if (this.totalCount > 0 && this.limit > 0) {
            this.startIndex = (this.page - 1) * this.limit + 1;
            this.endIndex = Math.min(
              this.startIndex + this.limit - 1,
              this.totalCount
            );
          } else {
            this.startIndex = 0;
            this.endIndex = 0;
          }

          console.log("Courses loaded:", this.courses);
        } else {
          console.error("Failed to load courses:", response.message);
        }
      },
      error: (error) => {
        console.error("API error:", error);
      },
      complete: () => {
        console.log("Admin list fetch completed.");
      },
    });
  }

  open(content: TemplateRef<NgbModal>): void {
    this.modalRef = this.modalService.open(content, { scrollable: true });
  }

  onSubmitCreateCourse(): void {
    if (this.addCourseForm.valid) {
      this.isSubmitting = true;

      const formData = new FormData();

      // Add scalar values
      formData.append("course_title", this.addCourseForm.value.course_title);
      formData.append("card_title", this.addCourseForm.value.card_title);
      formData.append("category", this.addCourseForm.value.category);

      if (this.files) {
        formData.append("course_img", this.files); // Single file for course image
      }

      this.courseService.createCourse(formData).subscribe({
        next: (response) => {
          console.log("response of create course - ", response);
          if (response.success) {
            this.isSubmitting = false;

            this.getCourse();
            this.files = null;
            this.toaster.success("Success", response.message);
            this.addCourseForm.reset();
            this.modalRef.close();
          } else {
            this.isSubmitting = false;

            this.toaster.warn("Alert", response.message);
            console.error("Failed to create course:", response.message);
          }
        },
        error: (error) => {
          this.isSubmitting = false;

          this.toaster.error("Error", "Something went wrong.");
          console.error("Error creating course:", error);
        }
      });
    }
  }

  onSelectImage(event: any): void {
    if (event.addedFiles && event.addedFiles.length > 0) {
      this.files = event.addedFiles[0]; // Store only the first selected file
    }
  }

  onRemoveFile(event: any) {
    // this.files.splice(this.files.indexOf(event), 1);
    this.files = null; // Clear the file
  }

  getSize(f: File) {
    const bytes = f.size;
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  /**
   * returns preview url of uploaded file
   */
  getPreviewUrlImg(f: File) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      encodeURI(URL.createObjectURL(f))
    );
  }

  goToCourseDetails(course: any): void {
    this.router.navigate([`admin/courses`, course.id]);


  }

  onPageChange(page: number): void {
    this.page = page;
    this.getCourse();
  }

  private getCategory(): void {
    this.categoryService.getCategory(this.page).subscribe({
      next: (response) => {
        if (response.success) {
          this.category = response.data.category;

          console.log("category loaded:", this.category);
        } else {
          console.error("Failed to load category:", response.message);
        }
      },
      error: (error) => {
        console.error("API error:", error);
      },
      complete: () => {
        console.log("Admin list fetch completed.");
      },
    });
  }
}
