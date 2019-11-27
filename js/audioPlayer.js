var AudioPlayer = function(url){
  this.originUrl = url
  this.audio
  this.duration
  this.status
  // 是否加载完毕
  this.loaded
  // options
  this.loop
  this.startTime
  this.volume
  // 加载完回调
  this.onAudioLoaded
  // 加载完立刻播放
  this.immeediately
}
AudioPlayer.prototype.play = function(){
  this.status = 'PLAY'
  this.audio.volume = this.volume
  var promise = this.audio.play()
  if (promise !== undefined) {
    promise.then( function(){
    }).catch(function(err){
    });
  }
}
AudioPlayer.prototype.load = function(){
  let self = this
  this.audio = new Audio(this.originUrl)
  this.audio.addEventListener('canplaythrough',onAudioLoaded)
  this.status = 'LOADING'
  function onAudioLoaded () {
    self.loaded = true
    self.status = 'LOADED'
    self.immeediately && self.play()
    self.onAudioLoaded && typeof self.onAudioLoaded == 'function' && self.onAudioLoaded()
  }

}
AudioPlayer.prototype.pause = function(){
  this.status = 'PAUSE'
}
AudioPlayer.prototype.getPosition = function(){
  
} 