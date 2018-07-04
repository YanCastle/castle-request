# castle 请求库
## 安装
```typescript
npm i -S castle-request
```
## 配置
```typescript
import {set_server} from 'castle-request'
set_server('http://www.baidu.com/')
```
## 创建实例
```typescript
import Request from './castle-request'
class Goods extends Request {
    _pk = "GoodsID"//设置主键
}
const r = new Goods();
export default r;
```
## 使用
```typescript
import Goods from '../api/Goods'
console.log(await Goods.search())
```