import Platform from "../../../framework/Platform";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PauseDialog extends cc.Component {

    onLoad () {}
    start () {}


    click_share()
    {
        Platform.share();
    }

    click_home()
    {
        cc.director.loadScene("Main")
    }


    click_restart()
    {
        cc.director.loadScene("Game")
    }
}