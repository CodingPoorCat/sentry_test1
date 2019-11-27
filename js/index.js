var funcSet = {
  runAnimation:function(){
    var lazyMan = new LazyMan()
    lazyMan.make(funcSet.container_in)
                .sleep(oPage.boxInDelay)
                  .make(funcSet.show_readyGo)
                    .sleep(3)
                      .make(funcSet.close_readyGo)
                          .make(funcSet.notifyAndriod)
  },
  notifyAndriod:function(){
    window.android&&"undefined"!=typeof window.android.invokeMethod&&window.android.invokeMethod("sign_start_anim_finish","")
  },
  pageReady: function(){
    window.android&&"undefined"!=typeof window.android.invokeMethod&&window.android.invokeMethod("pageReady","")
  },
  music_title: function(){
    var Lazy = new LazyMan()
    Lazy.make(function(){
          funcSet.fixChormeAudioPlay(oPage.audio_title)
          }).sleep(1)
            .make(funcSet.music_bg)
  },
  music_bg: function(){
    var Lazy = new LazyMan({isLoop:true})
    Lazy.make(function(){
            funcSet.fixChormeAudioPlay(oPage.audio_bg)
          }).sleep(5.9666)
              .make(function(){
                funcSet.fixChormeAudioPlay(oPage.audio_bg2)
              }).sleep(5.9666)
  },
  fixChormeAudioPlay: function(video){
    if(!video) return;
    var isPlaying = video.currentTime > 0 && !video.paused && !video.ended 
    && video.readyState > 2;
    if (!isPlaying) {
      // video.play();
      var promise = video.play()
      // if(video.networkState!==2){
      //   promise = video.play();
      // }
    if (promise !== undefined) {
        promise.then( function(){
        }).catch(function(err){
        });
    }
    }
  },
  playAudio: function(video){
    if(video){
      video.currentTime = 0;
      video.play()
    }
  },
  container_in: function(){
    var container = document.querySelector('.container')
    // container.classList.remove('container-before')
    container.classList.add('container-entry')
    funcSet.music_title();
    },
  openBox:function(id,count){
    var box = document.getElementById(id);
    var boxItem = box.querySelector('.openedBox')
    switch(count){
      case 5:
        boxItem.classList.add('box5');break;
      case 10:
        boxItem.classList.add('box10');break;
      case 15:
        boxItem.classList.add('box15');break;
    }
    box.classList.add('opening')
    if(oPage.submitStuNum<oPage.totalStuNum){
      oPage.submitStuNum+=1
      funcSet.updateStuSignNum()
    }
    setTimeout(function(){
      box.classList.remove('opening')
      box.classList.add('opened')
      funcSet.playAudio(oPage.audio_box)
      // oPage.taskList.next()
    },500)
  },
  getQueryByName:function(url,name){
    var reg=new RegExp('[?&]'+name+'=([^&#]+)');
    var query=url.match(reg);
    return query?query[1]:null;
    },
  ajax_getStudent:function(){
    var url = location.href;
    var appid = funcSet.getQueryByName(url,'appId')
    document.getElementById('logArea').innerHTML += url

    // appid = 'P7Q4W88PEUAEW4WO'
    // TODO 上线记得切换环境
    var host = location.host;
    var apiHost = ''
    if(host.indexOf('test') !== -1){
      apiHost = 'http://test.teaching.xiaojiaoyu100.com'
    }else if(host.indexOf('pre') !== -1){
      apiHost = 'http://pre.teaching.xiaojiaoyu100.com'
    }else if(location.protocol === 'file:') {
      apiHost = 'http://test.teaching.xiaojiaoyu100.com'
    }else{
      apiHost = 'http://teaching.xiaojiaoyu100.com'
    }
    ajax({
      url: apiHost+ '/tea_api/barrage/api/anon/queryAttendanceBarrage',
      type: 'GET',
      data: {
        appId:appid
      },
      success: function (response, xml) {
        var response = JSON.parse(response);
        response.data = {}
        response.data.studentList = [{studentName:'111',studentExtId:'111'},{studentName:'111',studentExtId:'111'}]
        if(response.data){
          oPage.studentList = response.data.attendanceStuList
          oPage.submitStuNum = response.data.submitStuNum
          oPage.totalStuNum = response.data.totalStuNum
          funcSet.updateStuSignNum()
          funcSet.renderBoxList()
          setTimeout(funcSet.runAnimation,500)
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  updateStuSignNum:function(){
    document.getElementById('submitStuNum').innerText = oPage.submitStuNum
    document.getElementById('totalStuNum').innerText = oPage.totalStuNum
  },
  renderBoxList:function(){
    // oPage.studentList = [].concat(oPage.studentList,oPage.studentList,oPage.studentList,oPage.studentList,oPage.studentList,oPage.studentList)
    if(oPage.studentList.length >= 28) {
      oPage.studentList.length = 28
    }
    var tpl = template('boxTpl',oPage.studentList)
    oPage.boxInDelay = (Math.floor(oPage.studentList.length / 7) + 2) * 0.5
    document.querySelector('.boxArea').innerHTML = tpl;
  },
  show_readyGo:function(){
    var layer = document.querySelector('.layer')
    layer.classList.add('showReady')
    funcSet.playAudio(oPage.audio_readyGo)
    setTimeout(function(){
      layer.classList.remove('showReady')
      layer.classList.add('showGo')
    },500)
    
  },
  close_readyGo:function(){
    var layer = document.querySelector('.layer')
    layer.classList.remove('showGo')
  },
  prepareMusic: function(){
    var promise = document.querySelector('audio').play();
    if (promise !== undefined) {
      promise.then(function(){
          // Autoplay started!
      }).catch( function(error){
          // Autoplay was prevented.
          // Show a "Play" button so that user can start playback.
      });
  }
    funcSet.loadMusic('audio_bg','bgMusic',1)
    funcSet.loadMusic('audio_bg2','bgMusic2',1)
    funcSet.loadMusic('audio_title','titleMusic',1)
    funcSet.loadMusic('audio_box','boxMusic',1)
    funcSet.loadMusic('audio_readyGo','readyGoMusic',1)
  },
  loadMusic: function (key,id,volume){
    oPage[key] = document.getElementById(id);
    oPage[key].load()
    if(volume){
      oPage[key].volume = volume
    }
  }
}
var oPage = {
  boxInDelay:0,//箱子进场所花时间
  step:0,
  currentCommemd:null,
  studentList:[],
  submitStuNum:0,
  totalStuNum:0,
  init: function(){
    // myUndefinedFunction();
    // funcSet.prepareMusic()
    funcSet.pageReady()
    funcSet.ajax_getStudent()
    // new Record('http://192.168.88.46:3000',{isInjectLog:true,isRecordPerformance:true,isRecordFPS:true})
    // console.log('开启签到弹幕')
    setTimeout(funcSet.runAnimation,500)
  }
}
Sentry.init({ dsn: 'http://8f4f7596c0f34a85ad5c43bc57bd3186@localhost:9000/5' });
oPage.init()

var signIn = function(sid,count){
  if(sid&&count){
    // oPage.taskList.add(function(){
      funcSet.openBox(sid,count)
    // })
  }
}

var preloadMusic = function(){
  funcSet.prepareMusic()
}