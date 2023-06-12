// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
   poster: 'https://d00.paixin.com/thumbs/2133879/37594015/staff_1024.jpg',
   name:'歌曲名',
   author:'',
   src:''
  },
  onShow() {
      console.log(getApp().id)
  },

  onInput(e){
    this.setData({
      name : e.detail.value
    })
  },
  onSearch(e){
    console.log(this.data.name)
    wx.request({
      url: 'https://music.163.com/api/search/get/web',
      data:{
        s : this.data.name,
        type: 1
      },
      success:res=>{
        console.log(res.data)
        let id = res.data.result.songs[0].id;
        let ids = '['+id+']'
        console.log(id)
        console.log(res)
        this.setData({
          author: res.data.result.songs[0].artists[0].name
        });
        wx.request({
          url: 'https://music.163.com/api/song/enhance/player/url',
          data:{
            id : id,
            ids : ids,
            br:3200000
          },
          success:res=>{
            let playUrl = res.data.data[0].url;
            console.log(playUrl)
            this.setData({
              src : playUrl
            });
            this.initAudio();
          }
        })
      }
    })
  },
  initAudio(){
    this.audioCtx.src = this.data.src
    this.audioCtx.onCanplay(()=>{
      setTimeout(()=>{
        this.setData({
          duration : this.audioCtx.duration
        })
      },500);
      console.log("可以播放！");
    })
  },
  audioPlay(e){
    this.audioCtx.play();
  },
  audioPause(e){
    this.audioCtx.pause();
  },
  audioSeek0(e){
    this.audioCtx.seek(0)
  },
  onLoad: function(options){
    this.audioCtx = wx.createInnerAudioContext()
  }
})
