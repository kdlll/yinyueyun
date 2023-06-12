// pages/zhuce/zhuce.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone:'',//电话
      name: '', // 昵称
      password: '' // 用户密码
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let userInfo = wx.getStorageSync('userInfo');
        this.setData({
            phone:userInfo.phone,
            name:userInfo.name,
            password:userInfo.password
        })
    },
  
    // 表单项内容发生改变的回调
    handleInput(event){
      // let type = event.currentTarget.id;// id传值 取值： phone || password
      let type = event.currentTarget.dataset.type; // data-key=value
      // console.log(event);
      this.setData({
        [type]: event.detail.value
      })
    },
    
    
    // 登录的回调
    async upDate(){
      // 1. 收集表单项数据
      let {phone,name, password} = this.data;
    
      // 后端验证
      wx.request({
        url: 'http://localhost:8080/last/upDate',
        data:{
          phone:phone,
          name:name,
          password:password
        },
        success:res=>{
        setTimeout(()=>{
            wx.showToast({
                title: '修改成功'
              })
        },1000)

          console.log(res)
           // 跳转至个人中心personal页面
          wx.reLaunch({
            url: '/pages/home/home'
          })
        },
        fail:res=>{
          wx.showToast({
            title: '修改失败，请稍后重试',
            icon: 'none'
          })
        }
        
      })
       
        
        
       
     
    },
    
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
  
    },
  
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
  
    },
  
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
  
    },
  
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
  
    },
  
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
  
    },
  
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
  
    },
  
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
  
    }
  })