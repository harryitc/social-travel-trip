---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/detail/quick-view/quick-view.component.html
---
<% if (featureToGenerate.includes('Quick_View')) { %>
  <div class="modal-header container border-bottom" *transloco="let translated"> 
    <h4 class="modal-title">
      <span> {{ translated(this.LANGUAGE_PATH.detail.quickView.title) }}</span>
    </h4>

  </div>
  <div class="modal-body container">
    <p>Hello, {{ this.item | json }}!</p>
    <p>
    </p>

  </div>
  <div class="modal-footer container border-top" *transloco="let translated" >
    <button type="button" class="btn btn-outline-dark" (click)="onCloseModal()">
      {{ translated(this.LANGUAGE_PATH.detail.quickView.closeButton) }}
    </button>
  </div>
<% } %>