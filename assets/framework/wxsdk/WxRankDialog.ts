import Platform from "../Platform";
import View from "../plugin_boosts/ui/View";
import ViewManager from "../plugin_boosts/ui/ViewManager";
import Common from "../plugin_boosts/utils/Common";
import Signal from "../plugin_boosts/misc/Signal";


const {ccclass, property} = cc._decorator;

@ccclass
export default class WxRankDialog extends cc.Component {
    
    first:boolean = true;

    closeSignal = new Signal();
    onShown(callback,target) {
        this.closeSignal.on(callback,target)
        if(this.first)
        {
            this.scheduleOnce(this.reOpen,0.1)
        }else{
            Platform.showRank();
        }
        
    }

    reOpen()
    {
        Platform.showRank();
        this.first = false;
        this.getComponent(View).hide();
        // setTimeout(() => {
            ViewManager.instance.show("wechat/WxRankDialog")
        // }, 100);
    }

    click_close()
    {
        Platform.hideRank();
        this.getComponent(View).hide();
        this.closeSignal.fire();
    }
}
