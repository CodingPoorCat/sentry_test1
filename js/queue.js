var Queue = function(coreNum) {
  this.taskList = []
  this.coreNum = coreNum ? coreNum : 1
  this.empty = true
  return this
}
Queue.prototype.next = function(){
  var self = this
  var cb = function () {
    if (self.taskList.length > 0) {
      this.empty = false
      var task = self.taskList.shift()
      task(cb)
    } else {
      self.empty = true
    }
  }
  for (var i = 0; i<this.coreNum;i++) {
    if (this.taskList.length > 0) {
      this.empty = false
      var task = this.taskList.shift()
      task(cb)
    }else{
      this.empty = true
    }
  }
  return this
}
Queue.prototype.add = function(task){
  if (typeof task !== 'function') throw('必须是函数')
  if(this.empty) {
    this.taskList.push(task)
    this.next()
  }else {
    this.taskList.push(task)
  }
  return this
}
Queue.prototype.getTaskCount = function() {
  return this.taskList.length;
}
Queue.prototype.unshift = function(task) {
  if (typeof task !== 'function') throw('必须是函数')
  this.taskList.unshift(task)
}
Queue.prototype.getTaskList = function(){
  return this.taskList
}
