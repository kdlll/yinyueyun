// pages/play/play.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        musicId:'2025533834',//默认歌曲
        changeDate:'暂停',
        action:{
            "method":"play"
        },
        name:'',
        imgUrl:'',
        lrcList1:[],
        index:0,//歌词下标
        top:0,
        mode:'loop',//播放模式
        //id列表
        IdList:[],
        //当前时间
        playtime:'00:00',
        //总时长
        totaltime:'03:00',
        //进度条最大值
        max:0,
        //进度条当前值
        move:0,
        

    },
  
    //进度条拖动
    silderchange(e){
        var e = e.detail.value
        this.setData({
            move:e
        })
        //设置播放时间
        this.setData({
            action:{
                method:"setCurrentTime",
                data:e
            }
        })
        this.setData({
            action:{
                method:"play"
            }
        })
    },
    //歌曲播放完是顺序还是单曲循环
    changeMusic(){
        var mode = this.data.mode
        if(mode=='single'){
            //单曲循环
            this.setData({
                musicId:this.data.musicId
            })
            //更新播放状态
            this.setData({
                action:{
                    method:"play"
                }
            })
        }else{
            this.nextSong()
        }
    },
    //上一曲
    lastSong(){
        var id = this.data.musicId
        var idlist = this.data.IdList
        console.log(idlist)
        var index = -1
        for(var i= 0;i<idlist.length;i++){
            if(id==idlist[i]){
                index=i
                break
            }

        }
        //判断是否为最后一首歌
        if(index==0){
            this.setData({
                musicId:idlist[idlist.length-1]
            })
        }else{
            this.setData({
                musicId:idlist[index-1]
            })
        }
        console.log(this.data.musicId)
        //更新播放
        this.setData({
            action:{
                method:"play"
            }
        })
        //更新歌词
        this.musicDetail()
        this.lrc()
    },
    //下一曲
    nextSong(){
        console.log(12)
        var id = this.data.musicId
        var idlist = this.data.IdList
        console.log(idlist)
        var index = -1
        for(var i= 0;i<idlist.length;i++){
            if(id==idlist[i]){
                index=i
                break
            }

        }
        //判断是否为最后一首歌
        if(index==idlist.length-1){
            this.setData({
                musicId:idlist[0]
            })
        }else{
            this.setData({
                musicId:idlist[index+1]
            })
        }
        console.log(this.data.musicId)
        //更新播放
        this.setData({
            action:{
                method:"play"
            }
        })
        //更新歌词
        this.musicDetail()
        this.lrc()
    },
    //播放顺序
    changeT(e){
        if(this.data.mode == 'loop'){
            this.setData({
                mode:'single'
            })
        }else{
            this.setData({
                mode:'loop'
            })
        }
    },
    //歌曲详情
    musicDetail(){
        var mid = this.data.musicId
        var that=this
        wx.request({
          url: 'http://music.163.com/api/song/detail/?id='+mid+'&ids=%5B'+mid+'%5D',
          success:res=>{
              var name = res.data.songs[0].name
              var imgUrl = res.data.songs[0].album.blurPicUrl
              that.setData({
                  name:name,
                  imgUrl:imgUrl
              })
          }
        })
    },

    shift(){
        var date = this.data.action.method
        if( date == "play"){
            this.setData({
                action:{
                    "method":"pause"
                },
                changeDate:'播放',
            })
        }else{
            this.setData({
                action:{
                    "method":"play"
                },
                changeDate:'暂停',
            })
        }
    },
    //歌词
    lrc(){
            var mid =getApp().id
            var src = 'https://music.163.com/api/song/lyric?id='+mid+'&lv=1&kv=1&tv=-1'
       
        var that = this
        wx.request({
          url: src,
          success:res=>{
              var lrc = res.data.lrc.lyric
              var lrcstrList= lrc.split("\n")
              var lrcList = []//存储歌词
              //设置正则 [03:53.513][03:54.95]
              var re= /\[\d{2}:\d{2}\.\d{2,3}\]/
                for(var i=0;i<lrcstrList.length;i++){//进行拆分时间和歌词的拆分
                    var date= lrcstrList[i].match(re)
                    //判断时间数组不能为空
                    if(date!=null){
                    // 拿到歌词 替换字符串
                    var lrc= lrcstrList[i].replace(re,"")
                    // 拿到时间字符串
                    var timestr=date[0]
                    //判断时间字符串是否为空
                    if(timestr!=null){
                        //清除掉括号
                        var timestr_slice = timestr.slice(1,-1)
                   //     console.log(timestr_slice)
                       // 时间和秒数的拆分
                        var splitlist= timestr_slice.split(":")
                        var f=splitlist[0]
                        var m=splitlist[1]
                      // 计算秒数
                        var time=parseFloat(f)*60+parseFloat(m)
                        lrcList.push([time,lrc])
                    }
                }
                
            }
          /*打印歌词  for(var i=0;i<lrcList.length;i++){
                console.log(lrcList[i])
                }
                */
            that.setData({
                lrcList1:lrcList
            })
            }
        })
    },
    //播放进度
    update(e){
         var playtime = e.detail.currentTime
         var listTime = this.data.lrcList1
         for(var i = 0;i<listTime.length-1;i++){
             if(listTime[i][0]<playtime&&playtime<listTime[i+1][0]){
                 this.setData({
                     index:i
                 })
             }
         }
         var index = this.data.index
         if(index>5){
             this.setData({
                 top:(index-5)*24
             })
         }

         //进度条实现方法
         //总时长
         var totaltime = e.detail.duration
         var sum_m = Math.floor(totaltime/60)
         var sum_s = Math.floor(totaltime%60)
         //个位补齐
         if(sum_m<10){
             sum_m="0"+sum_m
         }
         if(sum_s<10){
            sum_s="0"+sum_s
        }
        //定义播放时间
        var play_m = Math.floor(playtime/60)
        var play_s = Math.floor(playtime%60)
        if(play_m<10){
            play_m="0"+play_m
        }
        if(play_s<10){
            play_s="0"+play_s
       }
  
         this.setData({
             playtime:play_m+":"+play_s,
             totaltime:sum_m+":"+sum_s,
             max:totaltime,
             move:playtime
         })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },
  //收藏歌曲
  add(){
    var mid = this.data.musicId+""
    let userInfo = wx.getStorageSync('userInfo');
    var phone = userInfo.phone
    var soucang = []
    soucang =JSON.parse(userInfo.shoucang)
    console.log(soucang)
    soucang.push(mid)
    wx.request({
      url: 'http://localhost:8080/last/add',
      data:{
          phone:phone,
          shoucang:soucang
      },
      success:res=>{
        wx.showToast({
            title: '收藏成功'
          })
      }
    })
},
//最近播放
   bofang(){
    var mid = this.data.musicId
    let userInfo = wx.getStorageSync('userInfo');
    var zuijin = []
    zuijin =JSON.parse(userInfo.zuijin)
    var phone = userInfo.phone
    var newzuijin = mid+""
    //判断最近播放的长度
    if(zuijin.length<10){
        zuijin.push(newzuijin)
    }else{
        zuijin.slice(9,1)//删除第十个歌
        zuijin.push(newzuijin)
    }
    //添加最近播放
    console.log(mid)
    console.log(phone)
    console.log(zuijin)
    wx.request({
      url: 'http://localhost:8080/last/zuijin',
      data:{
          phone:phone,
          zuijin:zuijin
      },
      success:res=>{
          console.log(res)
          console.log('添加成功')
      }
    })
   },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        console.log(getApp().id)
        var mid =getApp().id
        console.log(getApp().IdList)
        var IdList = getApp().IdList
        this.setData({
            musicId: mid,
            IdList: IdList
        })
    
        this.musicDetail()
        this.lrc()
        this.bofang()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})