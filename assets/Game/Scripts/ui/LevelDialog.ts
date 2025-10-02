import { UserInfo } from "../Info";
import LevelSelector from "../../../framework/plugin_boosts/ui/game/LevelSelector";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelDialog extends cc.Component {

    onLoad () {}
    start () {}
    @property(LevelSelector)
    selector:LevelSelector;

    onShown()
    {
        this.selector.currentLevel = UserInfo.level;
        this.selector.refresh()

        this.scheduleOnce(this.refreshLevels, 0.1)
    }

    refreshLevels()
    {
        this.selector.scrollToCurrentLevel();
    }

    select_level(lvnode)
    {
        
        this.gotoLevel(lvnode.name)
    }

    refreshLevelItem(data)
    {
    }

    gotoLevel(lv)
    {
        lv =  parseInt(lv)
        console.log("enter level"  , lv);
        UserInfo.currentLevel = lv;
        cc.director.loadScene("Game")
    }

    click_continue()
    {
        this.gotoLevel(UserInfo.level)
    }
}