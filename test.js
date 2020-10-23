let middlewares = []

let use = (middleware) => {
    middlewares.push(middleware)
}

let compose = () => {
    return async ctx => {
        function createNext(middleware,oldNext){
            return async () => {
                await middleware(ctx,oldNext)
            }
        }

        let next = async () => {
            return Promise.resolve()
        }
        let len = middlewares.length;
        for(let i=len -1;i>=0;i--){
            let current = middlewares[i]
            next = createNext(current,next)
        }
        await next()
    }
}

use(async (ctx,next)=>{
    console.log('111')
    await next()
    console.log('222')
})

use(async (ctx,next) => {
    console.log('333')
    await next()
    console.log('444')
})

use(async (ctx,next) => {
    console.log('555')
    await next()
    console.log('666')
})

compose()({}).then(res=> console.log(res))

let middles = []

let use = (middle) => {
    middles.push(middle)
}

let compose = () => {
    return function(ctx){
        return dispatch(0)
        function dispatch(i){
            console.log(middles)
            let fn = middles[i]
            if(!fn){
                return;
            }
            fn(ctx,dispatch.bind(null,i+1))
        }
    }
}

use((ctx,next)=>{
    console.log('111')
    console.log(next)
    next()
    console.log('222')
})

use((ctx,next) => {
    console.log('333')
    next()
    console.log('444')
})

use((ctx,next) => {
    console.log('555')
    next()
    console.log('666')
})
