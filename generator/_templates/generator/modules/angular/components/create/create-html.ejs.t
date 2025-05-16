---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/create/create.component.html
---
<% if (featureToGenerate.includes('Create_One')) { %>
<div class="modal-header container border-bottom" *transloco="let translated">
  <h4 class="modal-title">
     {{translated(this.LANGUAGE_PATH.create.title) }} 
  </h4>
  <button class="close"
          [disabled]="this.isSaving"
          [style.cursor]="this.isSaving ? 'not-allowed':'pointer'"
          (click)="this.activeModal.close()">
    <span aria-hidden="true"><i class="fal fa-times"></i></span>
  </button>
</div> 

<div class="modal-body container" *transloco="let translated">
  @if(this.displayErrorMessage) {
  <div role="alert" class="alert alert-danger ng-star-inserted">
    <strong>{{this.displayErrorMessage}}</strong>
  </div>
  }

  <form [formGroup]="inputForm">
     <% for(var i=0; i < entityAttributes.length; i=i+2) { %>
        <div class="row">
        <div class="col-md-12">
            <label class="mt-1">
            <strong>
            {{ translated(this.LANGUAGE_PATH.create.labels.<%= h.changeCase.camelCase(entityAttributes[i])%>Label)  }}:     
            </strong>
             <span class="text-danger">*</span>
            </label>
            <input class="form-control"
                type="text"
                [placeholder]=translated(this.LANGUAGE_PATH.create.placeholder.<%= h.changeCase.camelCase(entityAttributes[i])%>Placeholder) 
                formControlName="<%= h.changeCase.camelCase(entityAttributes[i])%>">

            @if(this.inputForm.get('<%= h.changeCase.camelCase(entityAttributes[i])%>')?.hasError('required')
            && this.inputForm.get('<%= h.changeCase.camelCase(entityAttributes[i])%>')?.dirty) {
            <div class="invalid-feedback d-block">
            <span>
              {{ translated(this.LANGUAGE_PATH.create.errorMessage.<%= h.changeCase.camelCase(entityAttributes[i])%>RequireErrorMessage)  }}
            </span>
            </div>
            }
        </div>
        </div>
    <% } %>
  </form>
</div>

<div class="modal-footer container border-top"  *transloco="let translated">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-auto">
        <button class="btn btn-default" 
        [disabled]="this.isSaving" 
        [style.cursor]="this.isSaving ? 'not-allowed':'pointer'"
        (click)="this.activeModal.close()">
          {{ translated(this.LANGUAGE_PATH.create.button.goBack)  }}
        </button>
      </div>
      <div class="col-auto">
        <button class="btn btn-primary" 
        [disabled]="this.isSaving || !this.inputForm.dirty" 
        [style.cursor]="this.isSaving ? 'not-allowed':'pointer'"
        (click)="onSubmit()">
          <span *ngIf="isSaving" class="spinner-grow spinner-grow-sm mr-1" role="status" aria-hidden="true"></span>
          {{ translated(this.LANGUAGE_PATH.create.button.save)  }}
        </button>
      </div>
    </div>
  </div>
</div>
<% } %>  
