import MoreGameComponent from "./MoreGameComponent";
import { GameConfig } from "./GameConfigs";

const {ccclass, property} = cc._decorator;

export class Task
{
    id:number;
    gameConfig: any;
    isRunning: boolean = false;
    cd : number = 0;
    max_cd :number = 0;
    constructor(id)
    {
        this.id = id;
    }

    start()
    {
        this.isRunning = true;
    }

    finish()
    {
        this.isRunning = false;
        this.cd = this.max_cd;
    }
}

@ccclass
export default class MoreGameManager extends cc.Component {

    @property([MoreGameComponent])
    recommendComps :MoreGameComponent[] = [];

    private static _instance:MoreGameManager
    static get instance():MoreGameManager 
    {
        if (this._instance == null)
        {
            this._instance = cc.find("Canvas").addComponent(MoreGameManager);
        }
        return this._instance;
    }

    static set instance(k)
    {
        this._instance = k;
    }

    gameList:any[] = []

    tasks:Task[] = []

    frames:{[index:string]:cc.SpriteFrame} = {};

    /**
        content:"射了个球"
        extra:""
        icon:"https://111.231.94.213/game/gameres/recommend/game_01/icon.jpg"
        id:1
        image:"https://111.231.94.213/game/gameres/recommend/game_01/qr.png"
        title:"射了个球"
        wx_appid:"wxcd56cd0a66199638"
        launch:""
    */
    async getSpriteFrame(url:string):Promise<cc.SpriteFrame>
    {
        let frame = this.frames[url]
        if(frame == null)
        {
            return new Promise<cc.SpriteFrame>((resolve,reject)=>{
                // url = "https://cs-op.douyucdn.cn/douyu/2018/02/09/8a0dd8f98a3fa07c9543800173408477.png"
                console.log("[MoreGameManager] request image:" + url)
                cc.loader.load({url: url, type: 'png'}, (err, texture) =>{
                    
                    if(texture)
                    {
                        frame = new cc.SpriteFrame(texture);
                        this.addSpriteFrame(url ,frame)
                        // this.node.getComponent(cc.Sprite).spriteFrame=frame;
                        resolve(frame)
                    }else{
                        reject()
                    }
                    
                });
            })
        }
        return new Promise<cc.SpriteFrame>((resolve,reject)=>resolve(frame));
        
    }

    addSpriteFrame(url: string, frame: any): any {
        this.frames[url] = frame;
        return frame;
    }

    onLoad()
    {
        MoreGameManager.instance = this;
    }

    //tasks
    getTasks(priority_min: number,count:number): any {
        let todo = []
        for (var i = 0; i <this.tasks.length; i ++)
        {
            let task = this.tasks[i]
            if(task.gameConfig.priority && task.gameConfig.priority > priority_min)
            {
                if(task.cd == 0)
                {
                    todo.push(task)
                    this.tasks.splice(i,1)
                    i--;
                }
            }
            if (todo.length >= count) break;
        }
        if(todo.length < count)
        {
            // 任务不足，直接用cd中的任务补充
            //request from cd tasks 
            for (var i = 0; i <this.tasks.length; i ++)
            {
                let task = this.tasks[i]
                if(todo.indexOf(task) == -1)
                {
                    todo.push(task);
                    this.tasks.splice(i,1)
                    i -- ;
                }
            }
        }
        g.extendArray(this.tasks,todo);
        return todo;
    }

    finishTasks(list: Task[]): any {
        for(var i = 0 ;i < list.length; i ++ )
        {
            let task = list[i];
            if (task)
            {
                task.finish();
            }
        }
    }

    startTasks(list:Task[]):any{

        for(var i = 0 ;i < list.length; i ++ )
        {
            let task = list[i]; 
            if (task)
            {
                task.start();
            }
        }
    }
    
    createTasks()
    {
        for (var i = 0 ;  i < this.gameList.length;i++)
        {
            let task = new Task(i)
            task.gameConfig = this.gameList[i]
            task.gameConfig.priority = task.gameConfig.priority ||100;
            // 10 最小cd 时长 
            task.max_cd =  100 /task.gameConfig.priority * 10;
            this.tasks.push(task)
        }
    }

    addList(list:any)
    {
        if(list == null)
            return;
        if (Array.isArray(list) )
        {
            this.gameList.splice(0,this.gameList.length);
            g.extendArray(this.gameList,list);
        }else{
            this.gameList.push(list);
        }
        //sort by priority 
        this.gameList.sort((a,b)=>{
            if(!a.priority ) return 1;
            if(!b.priority) return 0;
            return b.priority - a.priority;
        })
        //create tasks
        this.createTasks();

        for (let i = 0; i < this.recommendComps.length; i++) {
            const element = this.recommendComps[i];
            element.requestTask()
        }

    }

    updateFinishedTask()
    {
        for (var i = 0; i < this.tasks.length; i++)
        {
            let task = this.tasks[i]
            //cd 中的任务
            if(task.cd > 0)
            {
                task.cd = Math.max(0,task.cd - 1);
            }
        }
    }
    /**
     * appId	string		是	要打开的小程序 appId	
        path	string		否	打开的页面路径，如果为空则打开首页	
        extraData	object		否	需要传递给目标小程序的数据，目标小程序可在 App.onLaunch，App.onShow 中获取到这份数据。	
        envVersion	string	release	否	要打开的小程序版本。仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版。	
        success	function		否	接口调用成功的回调函数	
        fail	function		否	接口调用失败的回调函数	
        complete	function		否	接口调用结束的回调函数（调用成功、失败都会执行）
        object.envVersion 的合法值

        envVersion >>--------------------
        develop	开发版
        trial	体验版
        release	正式版
     */
    clickGame(gamecfg)
    {
        console.log("打开小程序...")
        wx.navigateToMiniProgram({
            appId:gamecfg.wx_appid,
            extraData:{
                wx_appid:GameConfig.wx_appid,
            },
            envVersion:"release",
            success:(res)=>{
                console.log("打开小程序成功 :" + gamecfg.wx_appid)
                // 跳转通知服务器

            },
            fail:(res)=>{
                //打开失败
                console.log("打开小程序失败 :" +gamecfg.wx_appid)
            }
        })
        
        // 打开详情 或者直接打开
        //cfg.image  
    }

    onEnable()
    {
        this.schedule(this.updateFinishedTask,1,cc.macro.REPEAT_FOREVER);
    }

    onDisable()
    {
        this.unschedule(this.updateFinishedTask);
    }

    start()
    {
        // let gameList  = [
        //     {
        //         content:"射了个球",
        //         extra:"",
        //         icon:"https://111.231.94.213/game/gameres/recommend/game_01/icon.jpg",
        //         id:1,
        //         image:"https://111.231.94.213/game/gameres/recommend/game_01/qr.png",
        //         title:"射了个球",
        //         wx_appid:"wxcd56cd0a66199638",
        //         priority: 99,
        //     }
        // ]
        // let test = JSON.parse('{"priority":100,"title":"水果泡泡龙","extra":"empty","icon":"https://7265-release-2c87c4-1258399463.tcb.qcloud.la/pplicon.png?sign=43116a5ecfead6e614c52b9818cb15ec\u0026t=1547972497","image":"https://7265-release-2c87c4-1258399463.tcb.qcloud.la/qrcode (2).jpg?sign=43edc51f924e8a4e969e71c5e0753adf\u0026t=1547972423","wx_appid":"wxdbacbba2d0277152"}')
        // gameList.push(test);
        // this.addList(gameList)
    }
}