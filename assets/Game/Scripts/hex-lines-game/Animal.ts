import { R } from "./Res";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Animal extends cc.Component {

    @property(cc.Sprite)
    sprite:cc.Sprite = null;


    animation:cc.Animation = null;
    
    onLoad () {
        this.animation = this.getComponentInChildren(cc.Animation);
        this.animation.on("finished", this.onFinish,this)
    }

    onFinish(s,a:cc.AnimationState)
    {
        if(a.clip.name == "animal_jump")
        {
            this.animation.play("animal_idle")
        }
    }

    start () {
        this.animation.play("animal_idle");
    }

    connected() {
        let state = this.animation.play("animal_jump");
        state.wrapMode = cc.WrapMode.Normal;
    }

    _loopJump()
    {
        let state = this.animation.play("animal_jump")
        state.wrapMode = cc.WrapMode.Loop;
    }

    loopJump(d)
    {
        this.scheduleOnce(this._loopJump, g.randomFloat(0,d))
    }
}