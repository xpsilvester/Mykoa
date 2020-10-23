// module.exports = {
//     get query(){
//         return this.request.query;
//     },
//     get body(){
//         return this.response.body;
//     },
//     set body(data){
//         this.response.body = data
//     },
//     get status(){
//         return this.response.status
//     },
//     set status(statusCode){
//         this.response.status = statusCode
//     }
// }

let proto = {};

// function delegateSet(property,name){
//     proto.__defineSetter__(name,function(val){
//         this[property][name] = val;
//     })
// }

// function delegateGet(property,name){
//     proto.__defineGetter__(name,function () {
//         return this[property][name]
//     })
// }

// let requestSet = [];
// let requestGet = ['query','path','method'];

// let responseSet = ['body','status'];
// let responseGet = responseSet;

// requestSet.forEach(ele => {
//     delegateSet('request', ele)
// })

// requestGet.forEach(ele => {
//     delegateGet('request',ele)
// })

// responseSet.forEach(ele => {
//     delegateSet('response',ele)
// })

// responseGet.forEach(ele => {
//     delegateGet('response',ele)
// })
// getter代理
function delegateGetter(prop, name){
    proto.__defineGetter__(name, function(){
      return this[prop][name]
    })
  }
  // setter代理
  function delegateSetter(prop, name){
    proto.__defineSetter__(name, function(val){
      return this[prop][name] = val
    })
  }
  // 方法代理
  function delegateMethod(prop, name){
    proto[name] = function() {
      return this[prop][name].apply(this[prop], arguments)
    }
  }
  
  delegateGetter('request', 'query')
  delegateGetter('request', 'path')
  delegateGetter('request', 'method')
  
  delegateGetter('response', 'status')
  delegateSetter('response', 'status')
  delegateGetter('response', 'body')
  delegateSetter('response', 'body')
  delegateMethod('response', 'set')

module.exports = proto;