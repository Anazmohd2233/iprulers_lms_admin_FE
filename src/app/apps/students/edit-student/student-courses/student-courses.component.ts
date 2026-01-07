import { Component, Input, OnInit, TemplateRef } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BreadcrumbItem } from "src/app/shared/page-title/page-title.model";

// data
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { FormArray, FormBuilder, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { CourseService } from "src/app/core/service/course/course.service";
import { Course } from "src/app/apps/models/course";
import { StudentService } from "src/app/core/service/student/student.service";
import { ToastUtilService } from "src/app/apps/toaster/toasterUtilService";

@Component({
  selector: "app-student-courses",
  templateUrl: "./student-courses.component.html",
  styleUrls: ["./student-courses.component.scss"],
})
export class StudentCoursesComponent implements OnInit {
  @Input() studentID: any | null = null;
  modalRef!: NgbModalRef;

  assignCourseForm!: FormGroup;
  updateDateForm!: FormGroup;
  courses: Course[] = [];
  page: number = 1;
  courseId:any;
  isSubmitting: boolean = false;

  studentList: any;
  selectedCourse: any;

  studentCourse: any[] = [];

  ribbons = [
    {
      name: "CCIE EI v1.1 DOO-1 Section 2",
      img: "assets/images/sample.jpg",
      ribbon: { name: "Expired", color: "danger", direction: "left" },
    },
    {
      name: "CCIE EI v1.1 DOO-1 Section 3",
      img: "assets/images/sample2.jpg",
      ribbon: { name: "New", color: "success", direction: "right" },
    },
  ];

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private router: Router,
    private courseService: CourseService,
    private studentService: StudentService,
    private toaster: ToastUtilService
  ) {}

  ngOnInit(): void {
    if (this.studentID) {
      this.fetchStudentDetails(this.studentID);
    }

    this.getCourse();

    this.assignCourseForm = this.fb.group({
      course: ["", Validators.required],
      date: ["", Validators.required],
    });
    this.updateDateForm = this.fb.group({
      date: ["", Validators.required],
    });
  }


  private getCourse(): void {
    this.courseService.getCourses('all').subscribe({
      next: (response) => {
        if (response.success) {
          this.courses = response.data.courses;
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

  open(content: TemplateRef<NgbModal>, course?: any): void {
    if (course) {
      console.log('course',course)
      this.courseId=course.id;
      this.updateDateForm.patchValue({
        date: course.expiryDate,
      });
    }
    this.modalRef = this.modalService.open(content, { scrollable: true });
  }

  assignCourse(): void {
    if (this.assignCourseForm.valid) {
      this.isSubmitting = true;

      const formData = new FormData();

      // Add scalar values
      formData.append("course", this.assignCourseForm.value.course);
      formData.append("expiry", this.assignCourseForm.value.date);
      formData.append("id", this.studentID);

      this.studentService.assignCourseOrMaterials(formData).subscribe({
        next: (response) => {
          console.log("response of assign course - ", response);
          if (response.success) {
            this.isSubmitting = false;

            this.toaster.success("Success", "Course Assigned Successfully.");
            this.assignCourseForm.reset();
            this.fetchStudentDetails(this.studentID);
            this.modalRef.close(); // ✅ Close the modal here
          } else {
            this.isSubmitting = false;

            this.toaster.warn("Alert", response.message);

            console.error("Failed to assign course:", response.message);
          }
        },
        error: (error) => {
          this.isSubmitting = false;

          this.toaster.error("Failed", "Something went wrong.");

          console.error("Error assign course:", error);
        },
        complete: () => {
          console.log("Course assign successfully!...");
        },
      });
    }
  }

  updateDate() {
    if (this.updateDateForm.valid) {
      this.isSubmitting = true;

      const formData = new FormData();
      formData.append("expiry_date", this.updateDateForm.value.date);
      formData.append("course_id", this.courseId);

      // 📝 Edit Mode
      this.studentService
        .updateExpiry(formData)
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.isSubmitting = false;

              this.toaster.success("Success", response.message);
              this.fetchStudentDetails(this.studentID);
              this.updateDateForm.reset();
              this.modalRef.close();
            } else {
              this.isSubmitting = false;

              this.toaster.warn("Alert", response.message);
            }
          },
          error: () => {this.toaster.error("Error", "Something went wrong.");
            this.isSubmitting = false;

          }
        });
    } else {
      this.toaster.warn("Alert", "Please fill all mandatory fields..!");
    }
  }

  fetchStudentDetails(id: any): void {
    this.studentService.getStudentById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.studentCourse = response.data.courses;
          console.log("student course", this.studentCourse);
        } else {
          console.error("Failed to fetch data:", response.message);
        }
      },
      error: (error) => {
        console.error("Error fetching admin list:", error);
      },
      complete: () => {
        // Optionally handle the completion logic here
        console.log("Admin list fetch completed.");
      },
    });
  }
  openAlertModal(
    content: TemplateRef<NgbModal>,
    variant: string,
    course: any
  ): void {
    this.selectedCourse = course;
    this.modalRef = this.modalService.open(content, {
      size: "sm",
      modalDialogClass: "modal-filled bg-" + variant,
    });
  }

  deleteCourse(): void {
    if (this.selectedCourse) {
      this.isSubmitting = true;

      const formData = new FormData();

      const payload = {
        course_id: this.selectedCourse.id,
        student_id: this.studentID,
      };

      this.studentService.deleteCourse(payload).subscribe({
        next: (response) => {
          if (response.success) {
            this.isSubmitting = false;

            this.toaster.success("Deleted", response.message);
            this.fetchStudentDetails(this.studentID);
            this.modalRef.close();
          } else {
            this.isSubmitting = false;

            this.toaster.warn("Alert", response.message);
          }
        },
        error: () =>{ this.toaster.error("Error", "Something went wrong.");
          this.isSubmitting = false;

        }
      });
    } else {
      this.toaster.warn("Alert", "Enexpected error occured , contact admin");
    }
  }
}
