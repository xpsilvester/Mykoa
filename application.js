let EventEmitter = require('events');
let http = require('http');
let context = require('./context');
let request = require('./request');
let response = require('./response')

// let server = http.createServer((req, res) => {
//     res.writeHead(200);
//     res.end('hello world');
// });

// server.listen(3001, () => {
//     console.log('listenning on 3001');
// });
class Application extends EventEmitter{
    // 构造函数
    constructor(){
        super();
        this.callbackFunc;
        this.context = context;
        this.request = request;
        this.response = response;
        this.middlewares = [];
    }
    listen(...args){
        let server = http.createServer(this.callback())
        server.listen(...args)
    }
    use(middleware){
        this.middlewares.push(middleware);
    }
    // 中间件处理逻辑实现
    compose(){
        return async ctx => {
            function createNext(middleware,oldNext){
                return async () => {
                    await middleware(ctx,oldNext)
                }
            }

            let len = this.middlewares.length;
            let next = async () => {
                return Promise.resolve()
            }
            for(let i=len-1;i>=0;i--){
                let currentMiddleware = this.middlewares[i];
                next = createNext(currentMiddleware,next)
            }
            await next()
        }
    }
    // compose() {
    //     let $this = this
    //     return function(ctx) {
    //         return dispatch(0)
    //         function dispatch(i){
    //             let fn = $this.middlewares[i]
    //             if (!fn) {
    //                 return Promise.resolve()
    //             }
    //             // dispatch.bind(null, i + 1) 为应用中间件接受到的 next
    //             // next 即下一个应用中间件
    //             try {
    //                 return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)))
    //             } catch (error) {
    //                 return Promise.reject(error)
    //             }
    //         }
    //     }
    // }
    callback(){
        return async (req,res) => {
            let ctx = this.createContext(req,res);
            let respond = () => this.responseBody(ctx);
            let onerror = (err) => this.onerror(err,ctx)
            let fn = this.compose()
            return fn(ctx).then(respond).catch(onerror);
        }
    }
    onerror(err,ctx){
        if(err.code === 'ENOENT'){
            ctx.status = 404
        }else{
            ctx.status = 500
        }
        let msg = err.message || 'Internal error'
        ctx.res.end(msg)
        this.emit('error',err)
    }
    createContext(req,res){
        let ctx = Object.create(this.context);
        ctx.request = Object.create(this.request);
        ctx.response = Object.create(this.response);
        ctx.req = ctx.request.req = req;
        ctx.res = ctx.response.res = res;
        return ctx;
    }
    responseBody(ctx){
        let content = ctx.body;
        if(typeof content === 'string'){
            ctx.res.end(content)
        }else if(typeof content === 'object'){
            ctx.res.end(JSON.stringify(content))
        }
    }
}

module.exports = Application;