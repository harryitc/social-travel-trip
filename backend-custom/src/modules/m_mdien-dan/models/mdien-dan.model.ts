import { CreateMdienDanDTO } from '../dto/create-mdien-dan.dto';
import { UpdateMdienDanDTO } from '../dto/update-mdien-dan.dto';

/**
  Luồng xử lý dữ liệu được nhận từ controller 
  Service sẽ gọi các phương thức để thu thập dữ liệu từ controller, proxy, query,… 
  Sau đó dữ liệu sẽ được đưa vào model bằng các hàm setter, sau đó gọi hàm getter để lấy dữ liệu đã tổng hợp được 
  Service gọi command lưu trử lại
*/
export class MdienDanModel {
  // #resion contructor
  private user_id: number;
  
  private info!: any;
  private time_create!: Date;
  private time_update!: Date;

  constructor(args?: any) {
    const {
    user_id,
    info,time_create,time_update,
    } = args || {};
    this.user_id= user_id; 
    
    this.info = info;
    this.time_create = time_create;
    this.time_update = time_update;
  }
  setUserId(user_id:number):void {
    this.user_id= user_id;
  }
  getUserId() {
    return this.user_id;
  }
  
  setInfo(info:any): void {
    this.info = info;
  } 
  setTimeCreate(time_create:Date): void {
    this.time_create = time_create;
  } 
  setTimeUpdate(time_update:Date): void {
    this.time_update = time_update;
  } 
  
  getInfo() {
    return this.info;
  } 
  getTimeCreate() {
    return this.time_create;
  } 
  getTimeUpdate() {
    return this.time_update;
  } 
  // #endregion contructor

  // #region Bussiness LOGIC
  // Add your bussiness logic in this region
  // if your bussiness logic have any error please `throw LogicErrorException(`Your message`)`
  create(dto: CreateMdienDanDTO) {
    
    this.setInfo(dto.info);
    this.setTimeCreate(dto.time_create);
    this.setTimeUpdate(dto.time_update);
  };

  getModelCreated() {
    return {
     
       info: this.getInfo(),
       time_create: this.getTimeCreate(),
       time_update: this.getTimeUpdate(),
    }
  }

  update(dto: UpdateMdienDanDTO) {
    this.setUserId(dto.user_id);
    
    this.setInfo(dto.info);
    this.setTimeCreate(dto.time_create);
    this.setTimeUpdate(dto.time_update);
  }
  getModelUpdated() {
    return {
      user_id: this.getUserId(),
     
       info: this.getInfo(),
       time_create: this.getTimeCreate(),
       time_update: this.getTimeUpdate(),
    }
  }

  // #endregion Bussiness LOGIC

  // #region format data
  // Format item return in list.
  get getItemInListResponse() {
    return {
      user_id: this.getUserId(),
      
       info:this.getInfo(),
       time_create:this.getTimeCreate(),
       time_update:this.getTimeUpdate(),
    };
  }

  get getOneResponse() {
    return {
      user_id: this.getUserId(),
      
       info: this.getInfo(),
       time_create: this.getTimeCreate(),
       time_update: this.getTimeUpdate(),
    };
  }

  get getCreatedResponse() {
    return {
      user_id: this.getUserId(),
    }
  }

  get getUpdatedResponse () {
    return {
      user_id: this.getUserId(),
    }
  }

  get getDeleteManyResponse() {
    return {
      user_id: this.getUserId(),
      
       info: this.getInfo(),
       time_create: this.getTimeCreate(),
       time_update: this.getTimeUpdate(),     
    }
  }
  // Add other logic to format response data
  // #endregion format data
}
