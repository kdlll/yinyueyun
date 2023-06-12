// pages/search/search.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
       /* background: ['http://p1.music.126.net/qdK4eUqzglYvwDwr_1LhZQ==/109951165785979239.jpg?imageView&quality=89', 'http://p1.music.126.net/DrBuBbiLVjumIyaLwCpZtQ==/109951165785707267.jpg?imageView&quality=89', 'http://p1.music.126.net/BK8a96tG4E3mNyriYhcY_A==/109951168645888553.jpg?imageView&quality=89'],
       */
        musicList:[
         /*   {"src":"http://p2.music.126.net/Gm2v1KrDe2TwplzxcmTxYg==/109951168428025131.jpg?param=130y130",
            "album":{"name":"我们的歌"},
           "artists":[
             {
               "name":"刘大拿"
             }
           ],
            "id":"2025533834"},*/
             ],
        list:[],
        word:'',
        morenList:[
          "http://p2.music.126.net/Gm2v1KrDe2TwplzxcmTxYg==/109951168428025131.jpg?param=130y130"
        ],
        paihangList:[],
        IdList:[],
        imaUrlList:[
        ], //封面列表

        //歌曲数量
        musicSum:5
    },

    //下拉加载更多歌曲


    play(e){
        getApp().id =  e.currentTarget.dataset.id
        getApp().IdList = this.data.IdList
     /*   console.log(e.currentTarget.dataset.id)
        const id = e.currentTarget.dataset.id */
        wx.switchTab({
          url: '../play/play',
        })
        console.log(getApp().id)
    },
    //搜索
    onInput(e){
      var w = e.detail.value
      this.setData({
        word:w
      })
    },
    onSearch(){
      var w = this.data.word
      var that = this
      var musicSum = this.data.musicSum
      var idList = []
      var src = 'http://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s='+w+'&type=1&offset=0&total=true&limit='+musicSum
      wx.request({
        url: src,
        success:res=>{
          console.log(res.data.result.songs)
          var songs = res.data.result.songs
          that.setData({
            musicList:songs
          })
          console.log()
          for(var i=0;i<songs.length;i++){
            idList.push(songs[i].id)
            //存储列表
            that.setData({
              IdList:idList
            })
          }
          //再次搜索覆盖前一次封面
          that.setData({
            imaUrlList:[]
          })
          //调用寻找封面
          that.getMusicImage(idList,0,idList.length)
        }
      })
    },


     //通过id获取封面
     getMusicImage(idList,i,length){
      var Image_List = this.data.imaUrlList
      var that = this
      var url = 'http://music.163.com/api/song/detail/?id='+idList[i]+'&ids=%5B'+idList[i]+'%5D'
      wx.request({
        url: url,
        success:res=>{
          var img = res.data.songs[0].album.blurPicUrl
          Image_List.push(img)
          that.setData({
            imaUrlList : Image_List
          })
          //跳出递归
          if(++i<length){
            that.getMusicImage(idList,i,length)
          }
        }
      })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      //渲染轮播图每日推荐歌曲
      var that = this
      console.log(this.data.imaUrlList==[])
        wx.request({
            url: 'https://music.163.com/api/playlist/detail?id=3778678',
            data:{
                limit:10,
            },
            success:res=>{
              console.log(res.data)
              console.log(res.data.result.tracks)
              const sliceA = res.data.result.tracks.slice(0,5)
              this.setData({
                list: sliceA
              });
              console.log(this.data.list)

               //渲染排行榜
        wx.request({
          url: 'https://music.163.com/api/playlist/detail?id=2250011882',
          data:{
              limit:10,
          },
          success:res=>{
            console.log(res.data)
            console.log(res.data.result.tracks)
            const sliceA = res.data.result.tracks.slice(0,5)
            that.setData({
              paihangList: sliceA
            });
            console.log(that.data.paihangList)
          }
        })
            }
          })

       
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

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


      //输入框不能为空
      var word = this.data.word
      var that = this
      console.log(word)
      if(word!=''){
        console.log(1)
        var musicSum = this.data.musicSum
        musicSum+=2
        this.setData({
          musicSum:musicSum
        })
        var src = 'http://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s='+word+'&type=1&offset=0&total=true&limit='+musicSum
        var idList = []
        wx.showLoading({
          title: '加载中',
        })
        wx.request({
          url: src,
          success:res=>{
            var songs = res.data.result.songs
            that.setData({
              musicList:songs
            })
            for(var i=0;i<songs.length;i++){
              idList.push(songs[i].id)
              //存储列表
              that.setData({
                IdList:idList
              })
            }
            //再次搜索覆盖前一次封面
            that.setData({
              imaUrlList:[]
            })
            //调用寻找封面
            that.getMusicImage(idList,0,idList.length)
          }
        })

        setTimeout(function(){
          wx.hideLoading()
        },1000)
      }else{
        console.log("搜索框为空")
      }
    },

  
})