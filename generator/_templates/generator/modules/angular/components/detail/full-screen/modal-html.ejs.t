---
to:  <%= angularOutputPath %>/<%= h.changeCase.kebabCase(moduleName)%>/components/detail/full-screen/modal.component.html 
---
 <% if (featureToGenerate.includes('Fullscreen_Detail')) { %>
 
<ng-template #content let-modal >
  <div class="modal-body py-0 pl-0 pr-0 panel" style="min-height: 1200px;">
    <div class="panel-container show" *transloco="let translated">
      <div class="panel-content p-0">
        <div class="row">
          <div class="col-12">
            <div class="bg-primary-50">
              <div class="container-xl pt-3">
                <div class="d-flex align-items-center gap-10 fs-lg">
                  <button type="button"
                          class="btn btn-sm btn-outline-primary btn-icon waves-effect waves-themed"
                          data-dismiss="modal"
                          aria-label="Close"
                          (click)="onCloseModal()">
                    <span aria-hidden="true">
                        <i class="fal fa-arrow-left"></i>
                    </span>
                  </button>

                  <!-- DESIGN YOUR APP HEADER AT THIS TEMPLATE -->
                  <app-modal-fullscreen-header/>
                  <!-- DESIGN YOUR APP HEADER AT THIS TEMPLATE -->

                </div>

                <!-- BEGIN TAB NAME -->
                <ul class="nav nav-tabs nav-tabs-clean border-0 mt-3" role="tablist">

                  <li class="nav-item">
                    <a class="nav-link" (click)="onChangeTab(this.MODAL_ROUTING.ACTIVE_TABS.DISPLAY_TAB_GENERAL_INFO)"
                       [ngClass]="{ 'active': activeTab === this.MODAL_ROUTING.ACTIVE_TABS.DISPLAY_TAB_GENERAL_INFO}"
                       data-toggle="tab"
                       href="#{{this.MODAL_ROUTING.ACTIVE_TABS.DISPLAY_TAB_GENERAL_INFO}}" role="tab">
                     {{ translated(this.LANGUAGE_PATH.detail.modalFullScreen.activeTabs.genralInfo) }}
                    </a>
                  </li>

                  <li class="nav-item">
                    <a class="nav-link" (click)="onChangeTab(this.MODAL_ROUTING.ACTIVE_TABS.DISPLAY_TAB_OTHER_INFO)"
                       [ngClass]="{ 'active': activeTab === this.MODAL_ROUTING.ACTIVE_TABS.DISPLAY_TAB_OTHER_INFO}"
                       data-toggle="tab"
                       href="#{{this.MODAL_ROUTING.ACTIVE_TABS.DISPLAY_TAB_OTHER_INFO}}" role="tab">
                     {{ translated(this.LANGUAGE_PATH.detail.modalFullScreen.activeTabs.otherInfo) }}
                    </a>
                  </li>

                </ul>
                  <!-- END TAB NAME -->
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">

            <!-- BEGIN BODY TAB  -->
            <div class="tab-content p-3">

              <div class="tab-pane fade"
                   [ngClass]="{ 'show active': activeTab === this.MODAL_ROUTING.ACTIVE_TABS.DISPLAY_TAB_GENERAL_INFO }"
                   [id]="this.MODAL_ROUTING.ACTIVE_TABS.DISPLAY_TAB_GENERAL_INFO" role="tabpanel"
                   [attr.aria-labelledby]="this.MODAL_ROUTING.ACTIVE_TABS.DISPLAY_TAB_GENERAL_INFO">
               <app-general-info/>
              </div>

              <div class="tab-pane fade"
                   [ngClass]="{ 'show active': activeTab === this.MODAL_ROUTING.ACTIVE_TABS.DISPLAY_TAB_OTHER_INFO }"
                   [id]="this.MODAL_ROUTING.ACTIVE_TABS.DISPLAY_TAB_OTHER_INFO" role="tabpanel"
                   [attr.aria-labelledby]="this.MODAL_ROUTING.ACTIVE_TABS.DISPLAY_TAB_OTHER_INFO">
               Display your component for other info.
              </div>
            </div>
            <!-- END BODY TAB  -->
          
          </div>
        </div>
      </div>
    </div>
  </div>
</ng-template>
 <% } %>  

