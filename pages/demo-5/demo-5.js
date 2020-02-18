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
    let polygon = new QuarkRenderer.Polygon({
        position: [100, 100],
        scale: [1, 1],
        style: {
            fill: 'red'
        }
    });

    setInterval(function () {
        let len = Math.round(Math.random() * 100);
        let points = [];
        let r = (Math.random() * 100);
        for (let i = 0; i <= len; i++) {
            let phi = i / len * Math.PI * 2;
            let x = Math.cos(phi) * r + 100;
            let y = Math.sin(phi) * r + 100;
            points.push([x, y]);
        }
        polygon.animateTo({
            shape: {
                points: points
            }
        }, 500, 'cubicOut');
    }, 1000);
    qr.add(polygon);
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