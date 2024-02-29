import { User,ResPage } from "@/api/interface";
import request from "@/api/request";

// 获取用户列表
export const getUserList = (params?: User.ReqUserParams) => {
  return request.get<ResPage<User.UserList>>(`/users/list`, params || {page:1,limit:10});
};