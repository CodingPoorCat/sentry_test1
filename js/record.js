var Record = function(host,options){
  this.host = host
  this.nativeLog = console.log
  this.catchError()
  if(options){
    options.isInjectLog && this.injectLog()
    options.isRecordPerformance && this.recordPerformance()
    options.isRecordFPS && this.showFPS()
  }
}
/**
 * @method 劫持原生的log函数，执行log函数会上传到服务器
 */
Record.prototype.injectLog = function(){
  var self = this
  window.console.log = function(){
    var args = arguments;
    self.uploadMsg(args,'text')
    self.nativeLog.apply(this,args)
  }
},
/**
 * 
 * @param {*} msg 
 * @param {*} type 
 */
Record.prototype.uploadMsg = function(msg,type){
  if(typeof msg == 'object'){
    msg = JSON.stringify(msg)
  }
  __record_methods.ajax({
    url: this.host,
    type: 'POST',
    data: {
      type: type,
      content: msg,
      moment: +new Date()
    }
  })
}
Record.prototype.recordPerformance = function (){
  if(window.performance) {
    // 上传页面渲染关键信息
    var navigationStart = window.performance.timing.navigationStart
    var responseEnd = window.performance.timing.responseEnd
    var loadEventEnd = window.performance.timing.loadEventEnd
    var renderPerformance = {
      //首屏渲染
      firstRender : responseEnd - navigationStart,
      // 完全加载
      // completeLoad: loadEventEnd - navigationStart,
    }
    // this.nativeLog(renderPerformance)
    // this.uploadMsg(args,'renderPerformance')
  }
}
Record.prototype.showFPS = function(){
  var self = this
  var rAF = function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
  }();
  
  var frame = 0;
  var allFrameCount = 0;
  var lastTime = Date.now();
  var lastFameTime = Date.now();
  
  var loop = function () {
      var now = Date.now();
      var fs = (now - lastFameTime);
      var fps = Math.round(1000 / fs);
  
      lastFameTime = now;
      // 不置 0，在动画的开头及结尾记录此值的差值算出 FPS
      allFrameCount++;
      frame++;
  
      if (now > 1000 + lastTime) {
          var fps = Math.round((frame * 1000) / (now - lastTime));
          self.uploadMsg(fps,'fps')
          frame = 0;
          lastTime = now;
      };
  
      rAF(loop);
  }
  
  loop();
}

Record.prototype.catchError = function(){
  var self = this;
  console.log('开始捕捉')
  window.onerror = function(message, source, lineno, colno, error) {
    // self.nativeLog('有错误！！！！！！！！！')
    self.uploadMsg({message:message, source:source, lineno:lineno, colno:colno, error:error},'error')
  }
}
var __record_methods = {
  ajax: function(options) {
    options = options || {};
    options.type = (options.type || "GET").toUpperCase();
    options.dataType = options.dataType || "json";
    var params = __record_methods.formatParams(options.data);
  
    //创建 - 非IE6 - 第一步
    if (window.XMLHttpRequest) {
        var xhr = new XMLHttpRequest();
    } else { //IE6及其以下版本浏览器
        var xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
  
    //接收 - 第三步
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var status = xhr.status;
            if (status >= 200 && status < 300) {
                options.success && options.success(xhr.responseText, xhr.responseXML);
            } else {
                options.fail && options.fail(status);
            }
        }
    }
  
    //连接 和 发送 - 第二步
    if (options.type == "GET") {
        xhr.open("GET", options.url + "?" + params, true);
        xhr.send(null);
    } else if (options.type == "POST") {
        xhr.open("POST", options.url, true);
        //设置表单提交时的内容类型
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(params);
    }
  },
  //格式化参数
  formatParams: function(data) {
    var arr = [];
    for (var name in data) {
        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    // arr.push(("v=" + Math.random()).replace(".",""));
    return arr.join("&");
  }
}
