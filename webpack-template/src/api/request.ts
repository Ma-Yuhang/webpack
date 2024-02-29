import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { ResultData } from "./interface";

enum RequestEnums {
  TIMEOUT = 10000, // 请求超时 request timeout
  FAIL = 500, // 服务器异常 server error
  LOGINTIMEOUT = 401, // 登录超时 login timeout
  SUCCESS = 200, // 请求成功 request successfully
}

// axios 基础配置
const config = {
  baseURL: process.env.VUE_APP_API_URL, // 基础路径 /api
  timeout: RequestEnums.TIMEOUT as number, // 请求超时时间
  withCredentials: true, // 跨越的时候允许携带凭证
};

class Request {
  service: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    // 实例化 service
    this.service = axios.create(config);

    /**
     * 请求拦截器
     */
    this.service.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 在请求发送之前做一些处理
        // 例如：统一添加 token
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = "Bearer " + token;
        }
        return config;
      },
      (error: AxiosError) => {
        // 发送失败
        return Promise.reject(error);
      }
    );

    /**
     * 响应拦截器
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data } = response;
        if (data.code === RequestEnums.LOGINTIMEOUT) {
          // 表示登录过期，需要重定向至登录页面
          ElMessageBox.alert("Session 过期", "系统信息", {
            confirmButtonText: "重新登录",
            type: "warning",
          }).then(() => {
            // 或者调用 logout 方法去处理
            localStorage.setItem("token", "");
            location.href = "/";
          });
        }
        if (data.code && data.code !== RequestEnums.SUCCESS) {
          ElMessage.error(data);
          return Promise.reject(data);
        }
        return data;
      },
      (error: AxiosError) => {
        const { response } = error;
        if (response) {
          this.handleCode(response.status);
        }
        if (!window.navigator.onLine) {
          ElMessage.error("网络连接失败，请检查网络");
          // 可以重定向至404页面
        }
      }
    );
  }

  public handleCode = (code: number): void => {
    switch (code) {
      case 401:
        ElMessage.error("登陆失败，请重新登录");
        break;
      case 500:
        ElMessage.error("请求异常，请联系管理员");
        break;
      default:
        ElMessage.error("请求失败");
        break;
    }
  };

  // 通用方法封装
  get<T>(url: string, params?: object): Promise<ResultData<T>> {
    return this.service.get(url, { params });
  }

  post<T>(url: string, params?: object): Promise<ResultData<T>> {
    return this.service.post(url, params);
  }
  put<T>(url: string, params?: object): Promise<ResultData<T>> {
    return this.service.put(url, params);
  }
  delete<T>(url: string, params?: object): Promise<ResultData<T>> {
    return this.service.delete(url, { params });
  }
}

export default new Request(config);
