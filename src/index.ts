import axios from 'axios'
import * as store from 'store'
var Token = store.get('token')
const r = axios.create({
    withCredentials: true,
})
// 读取并设置token
r.interceptors.response.use(response => {
    if (response.headers['token']) {
        Token = response.headers['token'];
        store.set('token', Token)
    }
    return response.data
})
/**
 * 封装Token
 */
r.interceptors.request.use((req) => {
    req.headers['token'] = Token;
    return req;
})
export interface SearchParams {
    W?: any,
    P?: number,
    N?: number,
    Keyword?: string,
    Sort?: string
}
export const config: { Server: string, WSServer: string, WSClient?: any } = {
    Server: '',
    WSServer: '',
    // WSClient: {
}
export function get_url(Obj: string, Method: string): string {
    return `${config.Server}/${Obj}/${Method}`
}
/**
 * 配置服务器地址
 * @param server 
 */
export function set_server(server: string) {
    config.Server = server.endsWith('/') ? server.substr(0, server.length - 1) : server;
}
/**
 * 当前这个客户端的唯一编号
 * @param server 
 * @param address 
 */
export function set_ws_server(server: string, address: string = "") {
    config.WSServer = server;
    WSClient.server = server;
}
export var WSClient;

export enum RequestType {
    HTTP, Websocket
}
/**
 * 
 */
export default class Request {
    /**
     * 控制器名称
     */
    Controller: string = ''
    /**
     * 请求方式，默认为HTTP
     */
    RequestType: RequestType = RequestType.HTTP
    /**
     * 发送post请求
     * @param method 
     * @param Data 
     */
    async _post(method: string, Data: any) {
        if (this.RequestType == RequestType.HTTP) {
            let rs: any = await r.post(get_url(this.Controller, method), Data)
            if (rs.e) {
                throw new Error("string" == typeof rs.e ? rs.e : rs.e.m)
            }
            return rs.d
        } else {
            try {
                // return await config.WSClient.request(`${this.Controller}/${method}`, Data, { Type: RPCType.Request })
            } catch (error) {
                throw new Error("string" == typeof error ? error : error.message)
            }
        }
    }
    _pk: string = "";
    /**
     * 发送查询请求
     * @param Where 
     */
    async search(Where?: SearchParams) {
        return await this._post('search', Where);
    }
    /**
     * 发送添加请求
     * @param Data 
     */
    async add(Data: any) {
        return await this._post('add', Data);
    }
    /**
     * 发送删除请求
     * @param PK 
     */
    async del(PK: number | string) {
        return await this._post('del', { [this._pk]: PK });
    }
    /**
     * 发送保存请求
     * @param PK 
     * @param Data 
     */
    async save(PK: number | string, Data: any) {
        return await this._post('save', { [this._pk]: PK, Params: Data });
    }
    /**
     * 发送条件保存
     * @param W 
     * @param Data 
     */
    async saveW(W: Object, Data: Object) {
        return await this._post('saveW', { W, Params: Data });
    }
    /**
     * 条件删除
     * @param W 
     */
    async delW(W: Object) {
        return await this._post('delW', W);
    }
    /**
     * 批量添加
     * @param Data 
     */
    async adds(Data: Object[]) {
        return await this._post('adds', Data);
    }
    /**
     * 批量替换
     * @param W 
     * @param Data 
     */
    async replaceW(W: any, Data: any) {
        return await this._post('replaceW', { W, Data })
    }
}