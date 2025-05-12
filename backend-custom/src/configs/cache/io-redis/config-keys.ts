/**
 * Co the them prefix la ten chi nhanh neu can
 * Muc dich cho
 * e.g: hutech:project-permission-v2, uef:project-permission-v2, royal:project-permission-v2
 */
export const IO_REDIS_PERFIX = 'project-ioiort-crm:';

/**
 * Khai bao danh sach redis cache key cho toan project
 * Scope: project-name:module-name:feature-name:details-cache-key
 */
export const IO_REDIS_KEYS = {
  permission: {
    m_iam: {
      codeOTP: `m_permission:m-iam:code-otp:otp-user-key:`,
      userToken: `m_permission:m-iam:user-token:`,
      userDevice: `m_permission:m-iam:user-device:`,
      username: `m_permission:m-iam:username:`,
      roleContact: `m_permission:m-iam:role-contact:`,
      roleMenu: `m_permission:m-iam:role-menu:`,
      roleApi: `m_permission:m-iam:role-api:`,
      checkSpam: 'm_permission:m-iam:auth-check-spam:action:',
      checkSpamRate: 'm_permission:m-iam:auth-check-spam-rate:action:',
      m_token: `m_permission:m-iam:m-token:`,
      app: `m_permission:m-iam:app:`,
      usernameInfo: `m_permission:m-iam:username-info:`,
      contactInfo: `m_permission:m-iam:contact-info:`,
      apiName: `m_permission:m-iam:api-name:`,
    },
    M_MANAGE: {},
  },
  ioiort_crm: {
    sys_setting: {
      setting: `ioiort_crm:sys_setting:setting:`,
    },
    m_form: {
      node: `ioiort_crm:m_form:node`,
      form_node: `ioiort_crm:m_form:form_node`,
    },
    sys_quyen_du_lieu: {
      don_vi_quan_ly: {
        contact_id: 'ioiort_crm:sys_quyen_du_lieu:don_vi_quan_ly:contact_id',
      },
    },
    job_export_hopdong: {
      error: 'ioiort_crm:job_export_hopdong:error',
      job_delayed: 'ioiort_crm:job_export_hopdong:job_delayed',
    },
    care_history: {
      item: `ioiort_crm:care_history:item`,
    },
  },
};
