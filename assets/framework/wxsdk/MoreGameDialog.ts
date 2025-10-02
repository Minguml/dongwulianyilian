import MoreGameManager from "./MoreGameManager";
import MoreGameItem from "./MoreGameItem";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class MoreGameDialog extends cc.Component {

    @property(cc.Node)
    root:cc.Node = null;

    @property(cc.Sprite)
    banner:cc.Sprite = null;

    @property(cc.Label)
    title:cc.Label = null;

    @property(cc.Node)
    template:cc.Node = null;

    @property(cc.ScrollView)
    scrollView:cc.ScrollView = null;


    items : MoreGameItem[] = []

    onLoad()
    {
        // this.template
        
    }

    start () {
        
    }

    updateChildWidget(node)
    {
        let widget = node.getComponent(cc.Widget);
        if(widget) 
        {
            widget.updateAlignment();
        }
    }

    updateView()
    {
        let rect = this.banner.spriteFrame.getRect();
        let size = this.root.getContentSize();
        let ratio = size.width / rect.width;
        let calcHeight = ratio * rect.height;
        this.banner.sizeMode = cc.Sprite.SizeMode.RAW;
        this.banner.node.height = calcHeight;
        
        let bannerWidget = this.banner.getComponent(cc.Widget);
        bannerWidget.updateAlignment();

        let scrollviewWidget = this.scrollView.getComponent(cc.Widget)
        scrollviewWidget.top = calcHeight;
        scrollviewWidget.updateAlignment();
        g.foreachNode(this.scrollView.node,this.updateChildWidget,this)
        // console.log(size ,rect,calcHeight);
    }

    onEnable()
    {
        this.scheduleOnce(this.updateView)
        
    }

    async showBanner()
    {
        // this.banner.spriteFrame = await MoreGameManager.instance.getSpriteFrame(url);
        let rect = this.banner.spriteFrame.getRect();
        this.updateView();
    }

    toUserfriendlyNum(num:number)
    {
        if(num > 10000)
        {
            return (num/10000).toFixed(1) + "万"
        }
        return num +"";
    }

    onShown()
    {
        this.showBanner()
        let list = MoreGameManager.instance.gameList
        this.scrollView.content.removeAllChildren();
        this.items.splice(0,this.items.length)
        for (var i = 0 ;i < list.length; i ++)
        {
            var cfg = list[i];
            let node = cc.instantiate(this.template)
            let item = node.getComponent(MoreGameItem)
            item.title.string = cfg.title;
            item.content.string = cfg.content
            item.player_num.string = this.toUserfriendlyNum(cfg.players||100000)
            item.setStar(cfg.star|| 4);
            this.items.push(item);
            this.scrollView.content.addChild(node)
            if(item.btn.clickEvents.length > 0)
                item.btn.clickEvents[0].customEventData = i +"";
            if(item.btnSelf.clickEvents.length > 0)
                item.btnSelf.clickEvents[0].customEventData = i +"";
        }
        this.showIcons()
    }


    async showIcons()
    {
        let list = MoreGameManager.instance.gameList
        for (var i = 0 ;i < list.length; i ++)
        {
            var cfg = list[i];
            let item = this.items[i]
            item.icon.spriteFrame = await MoreGameManager.instance.getSpriteFrame(cfg.icon)
        }
    }

    on_click_enter(sender,i)
    {
        let list = MoreGameManager.instance.gameList
        var cfg = list[Number(i)]; 
        console.log(cfg)
        MoreGameManager.instance.clickGame(cfg)
    }

    // update (dt) {}
}
