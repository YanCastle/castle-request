import axios from 'axios'
const r = axios.create({
    withCredentials: true,
})
r.interceptors.response.use(response => {
    return response.data
})
export interface SearchParams {
    W?: any,
    P?: number,
    N?: number,
    Keyword?: string,
    Sort?: string
}
export const config = {
    Server: ''
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
export default class Request {
    async _post(method: string, Data: any) {
        let rs: any = await r.post(get_url(this.__proto__.constructor.name, method), Data)
        if (rs.e) {
            throw new Error(rs.e)
        }
        return rs.d
    }
    _pk: string = "";
    __proto__: any;
    async search(Where?: SearchParams) {
        return await this._post('search', Where);
    }
    async add(Data: any) {
        return await this._post('add', Data);
    }
    async del(PK: number | string) {
        return await this._post('del', { [this._pk]: PK });
    }
    async save(PK: number | string, Data: any) {
        return await this._post('save', { [this._pk]: PK, Params: Data });
    }
    async saveW(W: Object, Data: Object) {
        return await this._post('saveW', { W, Params: Data });
    }
    async delW(W: Object) {
        return await this._post('delW', W);
    }
    async adds(Data: Object[]) {
        return await this._post('adds', Data);
    }
    async replaceW(W: any, Data: any) {
        return await this._post('replaceW', { W, Data })
    }
}
