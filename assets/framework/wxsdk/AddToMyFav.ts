import { UserInfo } from "../../Game/Scripts/Info";
import Platform from "../Platform";

const {ccclass, property} = cc._decorator;


enum PositionType
{
    left,
    bottom,
    auto,
}

@ccclass
export default class AddToMyFav extends cc.Component {

    @property(cc.Node)
    pointer:cc.Node = null;

    @property({type:cc.Enum(PositionType)})
    posType:PositionType = PositionType.auto;

    @property()
    hideAfterSec:number = 30;

    widget:cc.Widget = null;

    onLoad () {
        this.widget = this.getComponent(cc.Widget);
    }

    start () {
        if(cc.sys.platform == cc.sys.WECHAT_GAME)
        {
            let options = Platform.getLaunchOptions()
            console.log("场景值 :" ,options);
            if(options.scene == 1001 || options.scene == 1089)
            {
                this.node.active = false;
                return;
            }
        }
        // if(g.isNextDay(UserInfo.showAddFavTime) )
        // {
        //     UserInfo.showAddFavTime = new Date().getTime();
        // }else{
        //     this.node.active = false;
        //     return;
        // }
        if(this.posType == PositionType.auto)
        {
            let ratio = cc.winSize.height/cc.winSize.width;
            if(ratio > 1.98)
            {
                this.showStyle2();
            }else{
                this.showStyle1();
            }
        }else if(this.posType == PositionType.bottom)
        {
            this.showStyle1()
        }
        else if(this.posType == PositionType.left)
        {
            this.showStyle2()
        }
        
        this.scheduleOnce(this.click_hide,this.hideAfterSec);
    }

    click_hide()
    {
        this.node.active = false;
    }

    showStyle1()
    {
        this.pointer.rotation = 0;
        this.widget.top = 128;
        this.widget.right = 140;
        this.widget.updateAlignment()
    }


    showStyle2()
    {
        this.pointer.rotation = 90;
        this.widget.top = 40;
        this.widget.right = 300;
        this.widget.updateAlignment()
    }
}