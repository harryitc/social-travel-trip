---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/update/update.component.ts
---
<% if (featureToGenerate.includes('Update_One')) { %>
import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, inject, } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { finalize } from "rxjs";
import { NgbActiveModal } from "@shared/components/lib-ng/lib-ng-bootstrap/modal/modal-ref";
import { ToastrService } from "@shared/components/lib-ngx/ngx-toastr/toastr/toastr.service";
import { <%= h.changeCase.pascalCase(moduleName)%>Service } from "../../services/<%= h.changeCase.kebabCase(moduleName)%>.service";
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";
import { LANGUAGE } from "../../<%= h.changeCase.kebabCase(moduleName)%>.config";

import _ from "lodash";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    ReactiveFormsModule,
  ],
  selector: 'app-update-<%= h.changeCase.kebabCase(moduleName)%>',
  templateUrl: './update.component.html',
})
export class Update<%= h.changeCase.pascalCase(moduleName)%>Component implements OnInit {
  @Input() item: object | any;

  router = inject(Router);
  service = inject(<%= h.changeCase.pascalCase(moduleName)%>Service);
  activeModal = inject(NgbActiveModal);
  toast = inject(ToastrService);

  LANGUAGE_PATH = LANGUAGE;

  isSaving: boolean = false;
  displayErrorMessage: string = '';

 // Declare input form
  inputForm!: FormGroup;

  ngOnInit(): void {
    this.inputForm = new FormGroup({
    <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
    <%= h.changeCase.camelCase(entityAttributes[i])%>: new FormControl(this.item?.<%= entityAttributes[i]%> ?? '', Validators.compose([Validators.required, Validators.minLength(1)])),<% } %>
    });
  }

  onSubmit() {
    // Before summit
    this.isSaving = true;
    this.inputForm.disable();
    this.displayErrorMessage = '';

    // Lấy thông tin từ form
    const formData = {
        <%= h.changeCase.camelCase(idField[0])%>: this.item?.<%= idField[0]%>,
        <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
        <%= h.changeCase.camelCase(entityAttributes[i])%>: this.inputForm.controls["<%= h.changeCase.camelCase(entityAttributes[i])%>"].value ?? '',<% } %>
    };

    this.service.update(formData)
    .pipe(
        finalize(() => {
            this.isSaving = false;
            this.inputForm.enable();
        }
    )).subscribe({
      next: (response) => {
        this.service.setChangedData(true);
        
        // Only when navigating to the list, the list must reload

        // Case navigate to detailpage - comment this line:
        this.service.reloadListWhenDataChanged(); 

        // Case navigate to detail - comment this line:
        /**
         this.router.navigate(
          [{ outlets: { fullscreen: [FULLSCREEN_MODAL_ROUTING.DETAILS_ROUTE, item.category_id] } }],
          {
            relativeTo: this.route,
            queryParams: {
              activeTab: FULLSCREEN_MODAL_ROUTING.ACTIVE_TABS.DISPLAY_TAB_GENERAL_INFO,
              activeSession: "phan-loai"
            },
            queryParamsHandling: 'merge',
          }
        );
        */

        this.activeModal.close()
      },
      error: (err) => {
        this.service.setChangedData(false);
        this.displayErrorMessage = `Please enter your error message when an error occurs`;
      },
    })
  }
}
<% } %>  