import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialsComponent } from "./materials/materials.component";
import { CategoriesComponent } from "./categories/categories.component";
import { AcademicsRoutingModule } from "./academics-routing.module";

import { FormsModule } from "@angular/forms";
import {
  NgbAccordionModule,
  NgbAlertModule,
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbNavModule,
  NgbProgressbarModule,
  NgbPaginationModule,
  NgbTimepickerModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgApexchartsModule } from "ng-apexcharts";
import { Select2Module } from "ng-select2-component";
import { SimplebarAngularModule } from "simplebar-angular";
import { PageTitleModule } from "src/app/shared/page-title/page-title.module";
import { WidgetModule } from "src/app/shared/widget/widget.module";
import { NgxDropzoneModule } from "ngx-dropzone";
import { AdvancedRoutingModule } from "src/app/pages/tables/advanced/advanced-routing.module";
import { StudentsComponent } from "../students/students/students.component";
import { AdvancedTableModule } from "./materials/advanced-table/advanced-table.module";
import { EditCourseComponent } from './courses/edit-course/edit-course.component';
import { CoursesComponent } from "./courses/course_list/courses.component";
import { EditNotesComponent } from './courses/edit-course/edit-notes/edit-notes.component';
import { EditCourseDetailsComponent } from './courses/edit-course/edit-course-details/edit-course-details.component';
import { EditLabComponent } from './courses/edit-course/edit-lab/edit-lab.component';
import { EditModulesComponent } from './courses/edit-course/edit-modules/edit-modules.component';
import { AccordionsRoutingModule } from "src/app/pages/uikit/accordions/accordions-routing.module";
import { SortablejsModule } from "ngx-sortablejs";

@NgModule({
  declarations: [
    CoursesComponent,
    MaterialsComponent,
    CategoriesComponent,
    EditCourseComponent,
    EditNotesComponent,
    EditCourseDetailsComponent,
    EditLabComponent,
    EditModulesComponent,
    
  ],
  imports: [
    CommonModule,
    AcademicsRoutingModule,
    FormsModule,
    SimplebarAngularModule,
    Select2Module,
    NgbProgressbarModule,
    NgbDatepickerModule,
    NgbTooltipModule,
    NgbAlertModule,
    NgbModalModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbPaginationModule,
    NgApexchartsModule,
    WidgetModule,
    PageTitleModule,
    NgxDropzoneModule,
    AdvancedTableModule,
    AdvancedRoutingModule,
    NgbNavModule,
    PageTitleModule,
    NgbAccordionModule,
    NgbCollapseModule,
    AccordionsRoutingModule,
    SortablejsModule,
    NgbTimepickerModule,

  ],
})
export class AcademicsModule {}
