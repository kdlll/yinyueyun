// pages/zhuce/zhuce.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      phone: '', // 手机号
      password: '' // 用户密码
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
  
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
    async register(){
      // 1. 收集表单项数据
      let {phone, password} = this.data;
    
      
      if(!phone){
        // 提示用户
        wx.showToast({
          title: '手机号不能为空',
          icon: 'none'
        })
        return;
      }
      
      if(!password){
        wx.showToast({
          title: '密码不能为空',
          icon: 'none'
        })
        return;
      }
    
      // 后端验证
      wx.request({
        url: 'http://localhost:8080/last/zhuce',
        data:{
          phone:phone,
          password:phone
        },
        success:res=>{
        setTimeout(()=>{
            wx.showToast({
                title: '注册成功'
              })
        },1000)

          console.log(res)
           // 跳转至个人中心personal页面
          wx.reLaunch({
            url: '/pages/login/login'
          })
        },
        fail:res=>{
          wx.showToast({
            title: '注册失败，请检查手机号码和密码是否正确',
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