// pages/home/home.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {}, // 用户信息
        recentPlayList: [], // 用户播放记录
        soucangList:[],//收藏列表
        soucangImg:[],//收藏封面
        bofangList:[],//播放记录列表
        bofangImg:[],//播放封面
    },

    toLogin(){
        wx.navigateTo({
            url: '/pages/login/login'
          })
    },

    toDetail(){
      wx.navigateTo({
        url: '/pages/detail/detail',
      })
    },
    //加载照片
    pic(){
      //我的收藏歌曲
        for(var i =0;i<this.data.soucangList.length;i++){
            console.log(this.data.soucangList[i])
            var url = 'http://music.163.com/api/song/detail/?id='+this.data.soucangList[i]+'&ids=%5B'+this.data.soucangList[i]+'%5D'
            var that = this
            var soucangImg = this.data.soucangImg
            wx.request({
              url: url,
              success:res=>{
                  console.log(res.data.songs[0].album.blurPicUrl)
                  var pic = res.data.songs[0].album.blurPicUrl
                  soucangImg.push(pic)
                  that.setData({
                      soucangImg:soucangImg
                  })
 
              }
            })
        }
        //最近播放
        for(var i =0;i<this.data.bofangList.length;i++){
          console.log(this.data.bofangList[i])
          var url = 'http://music.163.com/api/song/detail/?id='+this.data.bofangList[i]+'&ids=%5B'+this.data.bofangList[i]+'%5D'
          var that = this
          var bofangImg = this.data.bofangImg
          wx.request({
            url: url,
            success:res=>{
                console.log(res.data.songs[0].album.blurPicUrl)
                var pic = res.data.songs[0].album.blurPicUrl
                soucangImg.push(pic)
                that.setData({
                    bofangImg:bofangImg
                })

            }
          })
      }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let userInfo = wx.getStorageSync('userInfo');
        if(userInfo){ // 用户登录
          // 更新userInfo的状态
          console.log(userInfo)
          this.setData({
            userInfo: userInfo
          })
          this.setData({
            soucangList:JSON.parse(this.data.userInfo.shoucang),
            bofangList:JSON.parse(this.data.userInfo.zuijin)
          })
          this.pic()
          console.log(this.data.soucangList)
          console.log(this.data.userInfo)
          console.log(this.data.soucangImg[0])
       
        }    
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})