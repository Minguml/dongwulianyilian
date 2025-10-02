import { GameConfig } from "./GameConfigs";
import MoreGameComponent from "./MoreGameComponent";
import { Task } from "./MoreGameManager";
//小游戏跳转
//https://developers.weixin.qq.com/miniprogram/dev/dev/api/open-api/miniprogram-navigate/wx.navigateToMiniProgram.html?search-key=navigateToMiniProgram

const {ccclass, property} = cc._decorator;

@ccclass
export default class MoreGameStyle extends MoreGameComponent {

    @property([cc.Sprite])
    icons:cc.Sprite[] = []

    @property([cc.Button])
    buttons:cc.Button[] = []

    @property([cc.Label])
    labels:cc.Label[] = []

    datas:any[]  = []

    get count()
    {
        return this.icons.length;
    }

    onLoad()
    {
        for (var i = 0 ;i < this.buttons.length;i++)
        {
            let btn = this.buttons[i]
            let eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this.node;
            eventHandler.component = "MoreGameStyle"
            eventHandler.handler = "onClick"
            eventHandler.customEventData = i +"";
            btn.clickEvents.push(eventHandler)
            this.labels[i].node.active = false
            this.icons[i].node.active = false;
            btn.interactable = false;
        } 
    }


    onClick(sender,data:string)
    {
        let i = Number(data)
        let list = this.list
        let task = list[i]
        this.manager.clickGame(task.gameConfig);
    }


    onShow()
    {
        let list:Task[] = this.list;
        for (var i = 0 ;i < this.icons.length;i++)
        {
            let task = list[i];
            let icon = this.icons[i]
            if(task)
            {
                let label = this.labels[i]
                label.string = task.gameConfig.title
                this.labels[i].node.active = true
                icon.node.active = true;
                this.buttons[i].interactable = true
                this.manager.getSpriteFrame(task.gameConfig.icon).then(sf=>{
                    icon.spriteFrame = sf;
                })
                
            }
        }
    }
    // update (dt) {}
}
