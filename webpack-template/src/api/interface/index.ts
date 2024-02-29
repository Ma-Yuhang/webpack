// response interface { code, msg, success } 不含 data 数据
export interface Result {
  code: number;
  success: boolean;
  msg: string;
}

// request interface，包含 data 数据
export interface ResultData<T = any> extends Result {
  data?: T;
}

// 分页响应参数
export interface ResPage<T> {
  list: T[];
  page: number;
  limit: number;
  total: number;
}

// 分页请求参数
export interface ReqPage {
  page: number;
  limit: number;
}

export interface Column {
  prop: string;
  label: string;
}

// 用户管理模块
export namespace User {
  export interface ReqUserParams extends ReqPage {
    key?: string;
    val?: string;
  }
  export interface Address { 
    province: string,
    city: string
  }
  export interface UserList { 
    _id: string;
    address: Address;
    age: number;
    loginId: string;
    loginPwd: string;
    loves: string[];
    name: string;
  }
}