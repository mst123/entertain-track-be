import Axios, { type AxiosInstance, type Method, type AxiosRequestConfig, type AxiosResponse, type CustomParamsSerializer } from 'axios';
import { stringify } from 'qs';

const defaultConfig: AxiosRequestConfig = {
  // 请求超时时间
  timeout: 30000,
  baseURL: '/',
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer,
  },
};
// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const animeConfig: AxiosRequestConfig = {
  // 请求超时时间
  timeout: 30000,
  baseURL: 'https://api.myanimelist.net/v2/',
  headers: {
    'X-MAL-CLIENT-ID': '6ce00a71791d4866699ec1de1bea1811',
  },
};

const gameConfig: AxiosRequestConfig = {
  // 请求超时时间
  timeout: 30000,
  baseURL: 'http://api.steampowered.com/',
};

class MyHttp {
  /** 初始化配置对象 */
  private initConfig: AxiosRequestConfig;

  /** 保存当前Axios实例对象 */
  private static axiosInstance: AxiosInstance;

  /** 构造函数，接受自定义配置 */
  constructor(initConfig: AxiosRequestConfig = {}) {
    this.initConfig = initConfig;
    MyHttp.axiosInstance = Axios.create({ ...defaultConfig, ...this.initConfig });
  }
  /** 通用请求工具函数 */
  public request<T, P>(method: Method, url: string, param: T, config: AxiosRequestConfig): Promise<P> {
    const hasData = ['post', 'put', 'patch', 'delete'].includes(method);
    const finalConfig = {
      method,
      url,
      ...config,
      ...(hasData
        ? {
            data: param,
          }
        : {
            params: param,
          }),
    } as AxiosRequestConfig;

    // 单独处理自定义请求/响应回调
    return new Promise((resolve, reject) => {
      MyHttp.axiosInstance
        .request(finalConfig)
        .then((response: AxiosResponse) => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /** 单独抽离的post工具函数 */
  public post<T, P>(url: string, data: T = {} as T, config?: AxiosRequestConfig): Promise<P> {
    return this.request<T, P>('post', url, data, config);
  }

  /** 单独抽离的get工具函数 */
  public get<T, P>(url: string, params: T = {} as T, config?: AxiosRequestConfig): Promise<P> {
    return this.request<T, P>('get', url, params, config);
  }

  public patch<T, P>(url: string, data: T = {} as T, config?: AxiosRequestConfig): Promise<P> {
    return this.request<T, P>('patch', url, data, config);
  }

  public delete<T, P>(url: string, data: T = {} as T, config?: AxiosRequestConfig): Promise<P> {
    return this.request<T, P>('delete', url, data, config);
  }
}

export const myHttp = new MyHttp(animeConfig);
export const steamHttp = new MyHttp(gameConfig);
