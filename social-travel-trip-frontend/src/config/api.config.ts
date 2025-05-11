import { environment } from './environment';

export const API_ENDPOINT = {
  permissionV2: environment.domain.permission_v2,
  // TODO: Em nen config cai nay chi la domain thoi: https://eduzaa.hutech.edu
  // Con cac tinh nang ben trong em hay ghep phan duoi vao.
  // Ly do: Anh nghi cho nay chi nen config domain con chi tiet nghiep vu goi nhung api cu the nao thi vao ben trong tinh nang chinh.
  eduzaa_course_manager: `${environment.domain.eduzaa}/full-course/manage`,
  file_v2: `${environment.domain.file_v2}/file-v2`,
};
