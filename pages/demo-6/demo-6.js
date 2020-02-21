//这里使用 Node 模块的方式引入 Quark Renderer
let QuarkRenderer=require("quark-renderer");
console.log(QuarkRenderer);

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let ctx = wx.createCanvasContext('firstCanvas');
    //注意这里的初始化参数，因为微信小程序不允许操作 DOM，所以引擎不能自动获取到宽度高度，这里需要手动传进去
    let qr = QuarkRenderer.init(ctx,{width:300,height:500,renderer:'canvas'});
    console.log(qr);
    let gradient = new QuarkRenderer.LinearGradient();
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(1, 'black');

    for(let i=0;i<100;i++){
      let circle = new QuarkRenderer.Circle({
          position: [0, 0],
          scale: [1, 1],
          shape: {
              cx: 50*Math.random()*10,
              cy: 50*Math.random()*10,
              r: 20
          },
          style: {
              fill: gradient,
              lineWidth: 5,
              text:'circle',
              textPosition:'inside'
          }
      });
      qr.add(circle);
    }
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