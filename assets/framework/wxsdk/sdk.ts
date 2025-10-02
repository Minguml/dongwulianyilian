import { event } from "../plugin_boosts/utils/EventManager";
import { GameConfig } from "./GameConfigs";

class Global
{
    static videoAd= undefined
    static bannerAd= undefined

    static videoAdLoadCount= 0 //视频广告加载次数
    static bannerAdLoadCount= 0 //banner广告加载次数
}
class WxSdk {
    
    _userInfo: any;
    _parentId: any;
    _shareConfig: any;
    _db:any;
    _version: number;
    _systemInfo:any;

    public get Ver(): number { return this._version; }
    init() {
        if(g.iswxgame()) {
            if(this._version == null)
            {
                this._systemInfo = wx.getSystemInfoSync();
                let ver = this._systemInfo.SDKVersion.replace(/\./g, "")
                this._version = parseInt(ver);
            }
        }
    }

    requestDB(tbname,callback,target)
    {
        this._db.collection(tbname).get({
            success: function(res){
                console.log("get "+ tbname +" succ:" , res.data)
                // self._shareConfig = res.data;
                if(callback)callback.call(target,res.data);
            }, fail: (res)=>{
                console.log("get "+ tbname +" fail:")
                if(callback) callback.call(target)
            }
        });
    }

    requestConfig(callback)
    {
        this._db.collection("t_conf").get({
            success: function(res){
                console.log("get configs succ:" , res.data)
                // self._shareConfig = res.data;
                if(callback)callback(res.data);
            }, fail: (res)=>{
                console.log("get configs fail:" , res)
                if(callback) callback(null)
            }
        });
    }

    private requestShareContent(callback) {
        let self = this;
        if(this._shareConfig == null) {
            this._db.collection("t_share").get({
                success: function(res){
                    console.log("share configs succ:" , res.data)
                    self._shareConfig = res.data;
                    if(res.data && res.data.length > 0) {
                        let len = res.data.length;
                        let info = res.data[g.randomInt(0, len)];
                        if(callback)callback(info);
                    } else{
                        if(callback) callback(null)
                    }
                }, fail: (res)=>{
                    console.log("share configs fail:" , res)
                    if(callback) callback(null)
                }
            });
        } else {
            let len = this._shareConfig.length;
            let info = this._shareConfig[g.randomInt(0, len)];
            if(callback) callback(info);
        }
    }

    getShareContentSync()
    {
        if(this._shareConfig && this._shareConfig.length > 0)
        {
            let len = this._shareConfig.length;
            let info = this._shareConfig[g.randomInt(0, len)];
            return info
        }else{
            return {title:GameConfig.default_share_title,imageUrl:cc.url.raw(GameConfig.deafult_share_imgUrl)}
        }
        
    }

    private getShareContent(title?):Promise<{title:string,imageUrl:string,query?:string,success?:(res:any)=>void}> {
        return new Promise((resolve,reject)=>{
            this.requestShareContent(info=>{
                if(info)
                    resolve(info)
                else {
                    // reject("share config get failed!")
                    let ret= {
                        title: title || GameConfig.default_share_title,
                        imageUrl: cc.url.raw(GameConfig.deafult_share_imgUrl),
                        // imageUrl: "https://7465-tes-313f56-1257630180.tcb.qcloud.la/share/xuanchuan_1.png?sign=651306ddcd9dd2f24ea14d24e1dadc0e&t=1537024558",
                    }
                    resolve(ret);
                }
            })
        })
    }

    async openShare(title? ,uuid?,extra = "") {
        if(!g.iswxgame()) return;
        let info = await this.getShareContent(title);
        console.log(info);
        if(info != null) {
            // if(this._userInfo && this._userInfo.openId)
            uuid = uuid || (this._userInfo &&this._userInfo.openId) || 0
            info.query = "share_id="+uuid + "&time="+ new Date().getTime() + "&" +extra;
            // info.callback = ret=>{
            //     console.error("=>>>>>>>share:" ,ret);
            // }
            console.log("open Share",info.query)
            wx.shareAppMessage(info);
            // this.recordShare(Share.GAME, uuid);
        }
    }

    private createButton(callback, x?, y?, width?, height?) {
        console.log("-------------createButton");
        let button = wx.createUserInfoButton({
            type: "text",
            text:"     ",
            style: {
                x: x || 0, y: y || 0,
                width: width || cc.winSize.width,
                height: height || cc.winSize.height,
                lineHeight:40,
                backgroundColor:'#00000000',
                color:'#ffffff'
            }
        });
        button.onTap(function(res){
            button.destroy();
            if(res && res.userInfo) {
                if(callback) callback(res);
            } else if(callback) callback(null);
        });
    }

    get userInfo(){
        return this._userInfo.userInfo;
    }

    private getUserInfo(callback) {
        console.log("-------------getUserInfo");
        wx.getUserInfo({
            withCredentials: true,
            lang: "zh_CN",
            success: (res)=>{
                console.log("getUserInfo success.", res);
                if(callback) callback(res);
            }, fail: (res)=>{
                console.log("getUserInfo:", res);
                if(callback) callback(null);
            },
            complete: null
        });         
    }

    oldAuthUser(callback) {
        wx.authorize({
            scope: "scope.userInfo",
            success: (res)=>{
                console.log(res);
                if(callback) callback(true);
            }, fail: (res)=>{
                console.log(res);
                if(callback) callback(false);
            }, complete: null
        });
    }

    authUserInfo(callback) {

        this.wxLogin((isLogin)=>{
            if(!isLogin) return;
            wx.getSetting({
                success: (res)=>{
                    let auth = res.authSetting;
                    if(auth["scope.userInfo"]){
                        if(callback) callback(true);
                    } else if(callback) callback(false);
                }, fail: null,
                complete: null,
            });
        });
    }


    showShareMenu() {
        let self = this;
        wx.showShareMenu({
            withShareTicket: true,
            success: (res)=>{
                console.log(res);
            },fail: (res)=>{
                console.log(res);
            },complete: null
        });
        wx.onShareAppMessage(function(){
            let content = self.getShareContentSync();
            return content;
        });
    }


    private wxLogin(callback) {
        wx.login({
            success: (res)=>{
                console.log("code ", res.code);
                if(callback) callback(true);
            }, fail: (res)=>{
                if(callback) callback(false);
            }, complete: null
        });
    }


    private loginToServer(userInfo) {
        if(userInfo==null) userInfo={};
        this._userInfo = userInfo;
        userInfo.parentId = this._parentId;
        this.showShareMenu();
        event.emit("wxlogin");
        
    }

    public login(x?, y?, width?, height?){
        if(!g.iswxgame())return
        let self = this;
        wx.cloud.init({traceUser: true});
        // this._db = wx.cloud.database({env: "release-2c87c4"});//测试环境
        this._db = wx.cloud.database();

        self.authUserInfo((isAuth)=>{
            if(self._userInfo == null || 
                self._userInfo.userInfo == null){
                if(self._version >= 220 && !isAuth) {
                    self.createButton((userInfo)=>{
                        self.loginToServer(userInfo);
                    }, x, y, width, height);
                } else {
                    if(!isAuth){ self.oldAuthUser((isAuth)=>{
                        if(isAuth) {
                            self.getUserInfo((userInfo)=>{
                                self.loginToServer(userInfo);     
                            });
                        }else self.loginToServer(null);
                    })} else self.getUserInfo((userInfo)=>{
                        self.loginToServer(userInfo);
                    });
                }
            }
        });
    }

    public getParent() {
        if(!g.iswxgame()) return ""
        let info = wx.getLaunchOptionsSync();
        if(info.scene == 1007 || info.scene == 1008) {//通过分享进入游戏
            let openId = info.query["user_id"];
            return openId
        }
        return ""; //默认
    }

    //发送消息到子域
    public postMessage(cmd, data?) {
        if(g.iswxgame()) {
            wx.getOpenDataContext().postMessage({
                cmd: cmd,
                data: data
            });
        }
    }

    public uploadScore(score,callback?)
    {
        var kvDataList=new Array();
        kvDataList.push({
            key:"score",
            value:score+""
        });

        let obj = {
            KVDataList:kvDataList,
            success:function(d){
                if(callback) callback(d)
            },
            fail:function(){},
            complete:function(){},
        }
        wx.setUserCloudStorage(obj)
        // "wxgame": {
        //     "score": 16,
        //     "update_time": 1513080573
        // },
        // "cost_ms": 36500
    }

    public loadBannerAd(callback?){
        if(Global.bannerAd)
        {
            Global.bannerAd.destroy()
        }
        if(!this._systemInfo)
            this._systemInfo = wx.getSystemInfoSync();
        let bannerAd = wx.createBannerAd({
            adUnitId: 'adunit-fe3c074ad86d1b59',
            style: {
                left: 0,
                top: 0,//cc.visibleRect.height
                width: this._systemInfo.windowWidth
            }
        })
        bannerAd.onLoad(()=>{
            Global.bannerAd = bannerAd;
            Global.bannerAdLoadCount = 0;
            bannerAd.style.left = this._systemInfo.windowWidth/2 - bannerAd.style.realWidth/2;
            bannerAd.style.top = this._systemInfo.windowHeight - bannerAd.style.realHeight;
            if(callback) callback("load" ,bannerAd)
        })
        bannerAd.onError((err) =>{
            //加载失败
            console.log("wxsdk onError code:" + err.code + " msg:" + err.msg);
            Global.bannerAdLoadCount += 1;
            if (Global.bannerAdLoadCount < 4) {
                this.loadBannerAd(callback);
            }
            if(callback) callback("error")
        });
    }

    public showBannerAd(): any {
        console.log("Wxsdk 显示banner广告",Global.bannerAd)
        if (Global.bannerAd) {
            Global.bannerAd.show();
        } else {
            console.log("Wxsdk 不存在banner资源....");
            this.loadBannerAd((v,ad)=>{
                if(v=="load")
                {
                    this.showBannerAd()
                }
            });
        }
    }

    hideBannerAd() {
        if (Global.bannerAd) {
            Global.bannerAd.hide();
            // Global.bannerAd = null;
        } 
    }

    loadVideoAd(callback) {
        console.log("============wxsdk.loadVideoAD");
        // if (!Global.videoAd ) { //如果没有广告资源就加载新的视频广告
        let videoAd = wx.createRewardedVideoAd({
            adUnitId: 'adunit-5214efbe348a768c'
        })
        this.hideBannerAd();
        videoAd.load().then(()=>{videoAd.show();});
        videoAd.onError(err=> {
            //加载失败
            Global.videoAdLoadCount += 1;
            //尝试4次
            if (Global.videoAdLoadCount < 4) {
                this.loadVideoAd(callback);
            }
            if(callback) callback("error")
        });

        videoAd.onClose(function (ret) {
            //播放结束
            console.log("wxsdk onClose...");
            if(callback) callback("close",ret.isEnded)
            Global.videoAd = null;
        });

        videoAd.onLoad(()=>{
            //加载成功
            console.log("wxsdk onLoad");
            Global.videoAd = videoAd;
            Global.videoAdLoadCount = 0;
            this.showBannerAd();
            if(callback) callback("load" , videoAd)
        });
    }

}

export let wxsdk:WxSdk = new WxSdk();