/**
 * Quy định các loại type để nhận biết có phải xử lý đặc biệt theo loại
 * VD: IMAGE thì có resize
 */
export enum FILE_TYPE {
  IMAGE = 'image',
  FILE = 'file',
}

/**
 *  Quy định các thư mục lưu file theo option
 *  Nếu không có quy định thư mục con thì file sẽ nằm bên trong thư mục cha/ thư mục năm tháng.
 */
export enum FILE_FOLDER_TYPE {
  AVATAR = 'avatar',
  PROFILE = 'hinh-ho-so',
  NHAN_THAN = 'nhan-than',
  DIA_CHI = 'dia-chi',
  GPLD = 'gpld',
  TAM_NGHI = 'tam-nghi',
  HOC_HAM = 'hoc-ham',
  HOC_VI = 'hoc-vi',
  CHUNG_CHI = 'chung-chi',
  DANH_HIEU = 'danh-hieu',
  QD_TIEP_NHAN = 'qd-tiep-nhan',
  QD_BO_NHIEM = 'qd-bo-nhiem',
  QD_DIEU_DONG = 'qd-dieu-dong',
  QD_DIEU_CHUYEN = 'qd-dieu-chuyen',
  QD_THOI_VIEC = 'qd-thoi-viec',
  QD_KHEN_THUONG = 'qd-khen-thuong',
  QD_KY_LUAT = 'qd-ky-luat',
  HDLD = 'hdld',
  HDLD_PHU_LUC = 'hdld-phu-luc',
  GIAY_TO_KHAC = 'giay-to-khac',
  GIAY_TO_TUY_THAN = 'giay-to-tuy-than',
  IMPORT_EXCEL = 'import-excel',
}

// Các folder type nhận từ client để map với server
export type FOLDER_TYPE_ACCEPT_CLIENT = keyof typeof FILE_FOLDER_TYPE;

// Tiền tố file theo module
export const FILE_UPLOAD_PREFIX =
  process.env.FILE_UPLOAD_PREFIX ?? 'ioiort-hrm';
