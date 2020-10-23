let myKoa = require('./application')
const Router = require('./router/router')
let app = new myKoa();
const router = new Router()

let responseData = {}

app.use(async (ctx,next) => {
    responseData.name = 'xpsilvester';
    console.log(111)
    await next()
    ctx.body = responseData
})

app.use(async (ctx,next) => {
    responseData.age = 16;
    console.log(222)
    await next()
})

app.use(async (ctx,next) => {
    responseData.gender = 'male'
    next()
    //throw new Error('ooops');
})

router.get('/', function(ctx){
    responseData = {
        name: 'xpsilvester',
        age: 20
    }
    ctx.body = responseData
})

router.get('/test', function(ctx){
    ctx.body = {
        code: 200,
        msg: 'test'
    }
})


// 使用路由中间件
app.use(router.routes())
app.listen(3001,()=>{
    console.log('listening on 3001')
})