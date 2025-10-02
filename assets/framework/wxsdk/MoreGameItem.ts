const {ccclass, property} = cc._decorator;

@ccclass
export default class MoreGameItem extends cc.Component {

    @property(cc.Label)
    title:cc.Label = null;

    @property(cc.Label)
    content:cc.Label = null;

    @property(cc.Sprite)
    icon:cc.Sprite = null;

    @property(cc.Button)
    btn:cc.Button = null;

    btnSelf:cc.Button = null;


    @property(cc.Node)
    star_progress: cc.Node = null;

    @property(cc.Label)
    player_num:cc.Label = null;

    setStar(c)
    {
        this.star_progress.width = 125/5 * c;
    }

    
    onLoad()
    {
        this.btnSelf = this.getComponent(cc.Button);
    }
}