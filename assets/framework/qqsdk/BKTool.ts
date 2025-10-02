class Global
{
    static PUIN= "2896237320"

    static headUrl = ""
    static nickName = "";
    static videoAd= undefined
    static bannerAd= undefined

    static videoAdLoadCount= 0 //视频广告加载次数
    static viewAdLoadCount = 0 
    static bannerAdLoadCount= 0 //banner广告加载次数
}
// GameStatusInfo.src 其他取值
// 场景值（src）	场景描述	期望体验
// 100	AIO面板点击开始游戏	进入游戏大厅
// 108	AIO面板点击大面板小房子按钮	进入游戏大厅
// 110	AIO消息流文字识别	进入游戏大厅
// 202	热聊folder中点击进入游戏按钮	进入游戏大厅
// 207	旧版玩一玩WEB页面启动游戏	进入游戏大厅
// 208	新版玩一玩WEB页面启动游戏	进入游戏大厅
// 209	厘米城WEB页面启动游戏	进入游戏大厅
// 220	扫描二维码打开游戏	进入游戏大厅
// 200	点击AIO游戏邀请消息	"判断roomid若可加入则直接加入游戏不可加入相应提示后打开大厅"
// 204	在微信点击游戏邀请后打开手Q后启动游戏	同200
// 203	同200	将在手Q7.6.0后废弃
// 201	点击AIO游戏分享消息	根据拓展数据做相应处理

export default class BKTool
{

    // static BKGet(url, callback, custom) {
    //     let httpUtil = new BK.HttpUtil(url);
    //     httpUtil.setHttpMethod("get");
    //     httpUtil.custom = custom;
    //     //绑定回调对象
    //     httpUtil.requestAsync(callback.bind(httpUtil));
    // }

    /**
     * 跳转到其他游戏
     * @param {Number} gameId 
     */
    static skipGame(gameId) {
        BK.QQ.skipGame(gameId, "IJPay");
    }
    /**
     * 判断手Q版本
     * @param {String} ver1 7.9.0.3820 当前版本
     * @param {String} ver2 7.8.5 指定版本
     */
    static versionCompare(ver1, ver2) {
        ver1 = parseInt(ver1.replace(/\./g, "").substring(0, 3));
        ver2 = parseInt(ver2.replace(/\./g, "").substring(0, 3));
        if (ver1 >= ver2) {
            return true;
        } else {
            return false;
        }
    }

    static shareToArk() {
        BK.Share.share({
            qqImgUrl: 'http://hudong.qq.com/docs/engine/img/848B76B5530AA7EE7B38E9A1267D7086.png',
            isToFriend: true,
            summary: '单渠道分享-By Javen',
            extendInfo: 'IJPay',
            success: function (succObj) {
                console.log('分享成功', succObj.code, JSON.stringify(succObj.data));
            },
            fail: function (failObj) {
                console.log('分享失败', failObj.code, JSON.stringify(failObj.msg));
            },
            complete: () => {
                console.log('分享完成，不论成功失败');
            }
        });
    }

    static share(callback) {
        BK.Share.share({
            qqImgUrl: 'http://hudong.qq.com/docs/engine/img/848B76B5530AA7EE7B38E9A1267D7086.png',
            socialPicPath: 'GameRes://qrcode.png',
            title: '测试轻游戏',
            summary: '多渠道分享-By Javen',
            extendInfo: 'IJPay',
            // isToFriend:"false",
            success: function (succObj) {
                //{"reqCode":1,"ret":0,"gameId":3603,"aioType":1,"shareTo":0,"isFirstTimeShare":0}
                //ret成功：0；失败：1；取消：2
                //shareTo 分享渠道：QQ：0；QZone：1；微信：2；朋友圈：3
                console.log('分享成功', succObj.code, JSON.stringify(succObj.data));
                if(succObj.data.ret == 0)
                {
                    callback && callback("success",succObj.data);
                }else{
                    callback && callback("fail",succObj.data);
                }
            },
            fail: function (failObj) {
                console.log('分享失败', failObj.code, JSON.stringify(failObj.msg));
                callback && callback("fail");
            },
            complete: () => {
                console.log('分享完成，不论成功失败');
            }
        });
    }

    static shareLink() {
        BK.Share.share({
            qqImgUrl: 'http://hudong.qq.com/docs/engine/img/848B76B5530AA7EE7B38E9A1267D7086.png',
            msgUrl: 'https://gitee.com/javen205/Brickengine_Guide?', //不加问号分享的链接无法直接访问
            title: '测试轻游戏',
            summary: 'H5链接分享-By Javen',
            //分享出去的链接为
            //https://gitee.com/javen205/Brickengine_Guide?&gameId=游戏ID&roomId=房间ID&gameVersion=游戏版本号&uin=QQ号码
        });
    }

    static screenShotShare() {
        //实际像素
        var pixelSize = BK.Director.screenPixelSize;
        var pWidth = pixelSize.width;
        var pWheight = pixelSize.height;

        BK.Share.share({
            range: {
                x: pWidth / 2,
                y: pWheight / 2,
                width: pWidth,
                height: pWheight
            },
            qqImgUrl:"",// 分享到QQ的图片网络链接，必选，仅支持网络链接
            title: '测试轻游戏',
            summary: "截图分享-By Javen",
            extendInfo: 'IJPay',
            success: function (succObj) {
                console.log('分享成功', succObj.code, JSON.stringify(succObj.data));
            },
            fail: function (failObj) {
                console.log('分享失败', failObj.code, JSON.stringify(failObj.msg));
            },
            complete: () => {
                console.log('分享完成,不论成功失败');
            }
        });
    }

    static follow() {
        console.log("Global.PUIN>" + Global.PUIN);
        BK.QQ.enterPubAccountCard(Global.PUIN);
    }

    static getNick() {
        return Global.nickName;
    }

    static createShortCut()
    {
        var extendInfo = "";//扩展字段
        BK.QQ.createShortCut(extendInfo)
    }


    static getHead(){
    	return Global.headUrl;
    }

    /**
    	打开一个网页
    */
    openUrl(url){
    	BK.MQQ.Webview.open(url);
    }

        /**
    * 存储游戏个人私有数据
    * @param data 要存储的数据.
    */
    saveGameData(data){
        // 存储游戏个人私有数据
        // var data = {
        //     maxScore: 100,              // 一个历史最高积分
        //     // 不同游戏模式下存的数据，列表来的，可以根据自身需求使用，这里面的数据，后台不做任何处理，怎么来怎么回
        //     modeDatas:[
        //         {       // 字段都是自己定义的，后台不做任何处理
        //             maxScore: 1,
        //             mode: 1,
        //         },
        //         {       // 字段都是自己定义的，后台不做任何处理
        //             maxScore: 2,
        //             mode: 2,
        //         },
        //     ],
        // }
        return new Promise((resolve)=>{
            // 保存个人数据
            BK.QQ.saveGameData(data, (errCode, cmd, data)=>{
                BK.Console.log(1, 1, 'saveGameData : ' + errCode + ', ' + cmd + ', ' + data);
                resolve({errCode:errCode, cmd:cmd, data:data});
            });

        });
    }

    /**
    * 拉取游戏个人私有数据
    */
    loadGameData(){
        return new Promise((resolve)=>{
            BK.QQ.loadGameData((errCode, cmd, data)=> {
                // 这里返回的 data，就是上面存储游戏个人私有数据时候传入的 data
                BK.Console.log(1, 1, 'loadGameData : ' + errCode + ', ' + cmd + ', ' + data);
                resolve({errCode:errCode, cmd:cmd, data:data});
            });
        })
    }


      /**
    * 派发红包
    * @param {string} extendInfo 扩展的信息..
    */
    sendB2CRedPacket(extendInfo){
        return new Promise((resolve)=>{
            // var extendInfo = "xxxxxxx";
            BK.QQ.sendB2CRedPacket(extendInfo,function(errCode, cmd, data){
                BK.Script.log(1, 1, 'sendB2CRedPacket : ' + errCode + ', ' + cmd + ', ' + JSON.stringify(data));
                if(errCode == 0){
                    //派发成功
                }else{
                    //派发失败
                }

                resolve({errCode:errCode, cmd:cmd, data:data});
            });
        });
    }

    static login()
    {
        BK.MQQ.Account.getHead(GameStatusInfo.openId,(openId, imgPath)=> {
            // resolve(imgPath)
            Global.headUrl = imgPath;
        });
        BK.MQQ.Account.getNick(GameStatusInfo.openId, (openId,nickName)=>{
            Global.nickName = nickName;
        });
    }

    static test(){
		// BK.QQ.fetchOpenKey(function (errCode, cmd, data) {
		// 	console.log("[fetchOpenKey]",errCode, cmd, data)
		//     if (errCode == 0) {
		//          var openKey = data.openKey;
		//      }
		// });
		var openId = GameStatusInfo.openId;
		console.log("openId:",openId);
    	var systemInfo = BK.getSystemInfoSync();

		BK.Console.log('游戏版本号:'+systemInfo.gameVersion);
		BK.Console.log('是否房主:'+systemInfo.isMaster);   //使用厘米秀房间时才有效
		BK.Console.log('房间号:'+systemInfo.roomId); //使用厘米秀房间时才有效
		BK.Console.log('系统版本:'+systemInfo.osVersion);
		BK.Console.log('网络类型:'+systemInfo.networkType);

		BK.Console.log('平台:'+systemInfo.platform);
		BK.Console.log('当前用户的标识:'+systemInfo.openId);
		BK.Console.log('手机qq版本:'+systemInfo.QQVer);

		BK.Console.log('是否首次安装:'+systemInfo.isFirstInstall);
		BK.Console.log('当前聊天窗类型:'+systemInfo.aioType);
		BK.Console.log('游戏启动入口:'+systemInfo.src);
		BK.Console.log('是否为管理账号:'+systemInfo.isWhiteUser);
		BK.Console.log('游戏类型:'+systemInfo.gameType);
		BK.Console.log('具体机型:'+systemInfo.model);
		BK.Console.log('性别:'+systemInfo.sex);

    	
    }

    /**
     * 成绩上报
     * @param {*} level 
     * @param {*} callback 
     */
    static uploadScore(score, callback?) {
        var data = {
            userData: [{
                openId: GameStatusInfo.openId,
                startMs: (new Date().getTime() - 60 * 5 * 1000).toString(),
                endMs: ((new Date()).getTime()).toString(),
                scoreInfo: {
                    score: score,
                },
            }, ],
            attr: {
                score: {
                    type: 'rank',
                    order: 1,
                }
            },
        };
        BK.QQ.uploadScoreWithoutRoom(1, data, function (errCode, cmd, data) {
            console.log("-------------uploadScoreWithoutRoom callback  cmd" + cmd + " errCode:" + errCode + "  data:" + JSON.stringify(data));
            if (callback) {
                callback(errCode, data);
            }
        });
    }
    /**
     * 拉取排行榜数据
     * @param {*} callback [code,list]
     */
    static getRankList(callback) {
        let attr = "score";
        let order = 1; //排序的方法：[ 1: 从大到小(单局)，2: 从小到大(单局)，3: 由大到小(累积)]
        let rankType = 0;//要查询的排行榜类型，0: 好友排行榜
        BK.QQ.getRankListWithoutRoom(attr, order, rankType, function (errCode, cmd, data) {
            console.log("--------------------getRankListWithoutRoom callback  cmd" + cmd + " errCode:" + errCode);
            if (errCode != 0) {
                callback && callback(errCode);
                return;
            }
            if (data) {
                let rankList = data.data.ranking_list;
                console.log("=====data not null " + rankList.length);
                //{"data":{"ranking_list":["nick":"Damon Ren","score":304,"selfFlag":1,"url":"","seqId":0]}}
                console.log(JSON.stringify(data));
                if (callback) {
                    callback(errCode, rankList);
                }
            }
        });
    }
    /**
     * //展示广告 Global.videoAd.show();
     * 预加载视频广告
     */
    static loadVideoAd(callback) {
        console.log("============BKTOOl.loadVideoAD" , Global.videoAd);
        
        // if (!Global.videoAd ) { //如果没有广告资源就加载新的视频广告
        let videoAd = BK.Advertisement.createVideoAd();
        videoAd.onError(function (err) {
            //加载失败
            console.log(">>>>>>>>>BKTools onError code:" + err.code + " msg:" + err.msg);
            Global.viewAdLoadCount += 1;
            //尝试4次
            if (Global.viewAdLoadCount < 4) {
                BKTool.loadVideoAd(callback);
            }
            if(callback) callback("error")
        });

        videoAd.onPlayFinish(function () {
            //播放结束
            console.log("BKTools onPlayFinish...");
            Global.videoAd = undefined;
            if(callback) callback("finish")
        });
        videoAd.onClose(function () {
            //播放结束
            console.log("BKTools onClose...");
            if(callback) callback("close")
            Global.videoAd = undefined;
        });

        videoAd.onLoad(function () {
            //加载成功
            console.log("BKTools onLoad");
            Global.videoAd = videoAd;
            Global.videoAdLoadCount = 0;
            if(callback) callback("load" , videoAd)
        });
    }
        //  else {
        //     console.log("BKTools 已存在广告资源 或者 非QQ玩一玩平台....");
        // }

    /**
     * //展示广告 Global.bannerAd.show();
     * 预加载banner广告
     * 1001静态banner，1002动态banner，1003 广点通banner(7.8.0)
     */
    static loadBannerAd(callback?, viewId?) {
        if (!viewId) {
            let qqVer = BK.getSystemInfoSync().QQVer;
            console.log("当前手Q版本:" + qqVer);
            let isBig = BKTool.versionCompare(qqVer, "7.8.5"); //如果大于7.8.5
            console.log("当前版本大于7.8.5:" + isBig);
            if (isBig) {
                viewId = 1003;
            } else {
                viewId = 1002;
            }
        }
        console.log("loadBannerAd viewId:" + viewId);
        let bannerAd = BK.Advertisement.createBannerAd({
            viewId: viewId,
        });
        bannerAd.onError(function (err) {
            //加载失败
            console.log("BKTools onError code:" + err.code + " msg:" + err.msg);
            Global.bannerAdLoadCount += 1;
            if (Global.bannerAdLoadCount < 4) {
                BKTool.loadBannerAd(callback,viewId);
            }
            if(callback) callback("error")
        });
        bannerAd.onLoad(function () {
            //加载成功
            console.log("BKTools onLoad");
            Global.bannerAd = bannerAd;
            Global.viewAdLoadCount = 0;
            if(callback) callback("load" ,bannerAd)
        });
    }

    static showBannerAd() {
        console.log("BKTools 显示banner广告")
        if (Global.bannerAd) {
            Global.bannerAd.show();
        } else {
            console.log("BKTools 不存在banner资源....");
            BKTool.loadBannerAd((v,ad)=>{
                if(v=="load")
                {
                    BKTool.showBannerAd()
                }
            });
        }
    }

    static hideBannerAd() {
        if (Global.bannerAd) {
            Global.bannerAd.hide();
            Global.bannerAd = undefined;
        } else {
            console.log("BKTools 不存在banner资源无法关闭....");
        }
    }

    static showToast(title, duration) {
        if (!duration) {
            duration = 3000;
        }
        if (cc.sys.platform == cc.sys.QQ_PLAY) {
            BK.UI.showToast({
                title: title,
                duration: duration,
                complete: function () {
                    console.log("BKTools showToast complete:" + title);
                }
            });
        }
    }
    /**
     * 开启屏幕常亮
     */
    static keepScreenOn() {
        BK.Device.keepScreenOn({
            isKeepOn: true
        });
    }
    /**
     * 取消屏幕常亮
     */
    static cancelKeepScreenOn() {
        BK.Device.keepScreenOn({
            isKeepOn: false
        });
    }

}
