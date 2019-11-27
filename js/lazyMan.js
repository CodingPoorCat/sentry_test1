var LazyMan = function (options) {
  this.queue = []
  if(options){
    this.isLoop = options.isLoop || false
  }
  this.currentIndex = 0
  var self = this
  setTimeout(function(){
    self.next()
  },0)
}
LazyMan.prototype.sleep = function(delay){
  var self = this
  var fnc = (function (delay) {
    return function(){
      setTimeout(function(){
        if(self.isLoop){
          self.currentIndex++
        }
        self.next()
      },delay*1000)
    }
  })(delay);
  this.queue.push(fnc);
  return this
}
LazyMan.prototype.make = function(fn,args){
  var self = this
  if (typeof fn !== 'function'){
    throw ('LazyMan\'s make 必须是函数')
  }
  var fnc = (function(){
    return function(){
      fn(args)
      if(self.isLoop){
        self.currentIndex++
      }
      self.next()
    }
  })(fn);
  this.queue.push(fnc)
  return this
}
LazyMan.prototype.next = function(){
  var task;
  if(this.isLoop){
    this.currentIndex %= this.queue.length;
    task = this.queue[this.currentIndex]
  }else{
    task = this.queue.shift();
  }
  task && task()
}