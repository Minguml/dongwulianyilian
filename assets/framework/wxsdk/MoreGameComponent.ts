import MoreGameManager, { Task } from "./MoreGameManager";

const {ccclass, property} = cc._decorator;
@ccclass
export default class MoreGameComponent extends cc.Component
{
    _manager:MoreGameManager;
    isManaged:boolean = true;

    @property
    refreshInterval: number = 60;

    @property
    priority_min :number = 50;

    _list:Task[] = []

    get count(){return 0;}

    get manager()
    {
        return MoreGameManager.instance;
    }

    requestTask()
    {
        let list = this.manager.getTasks(this.priority_min,this.count);
        this.manager.finishTasks(this._list)
        this.show(list);
        this.manager.startTasks(list);
    }

    start()
    {
        
    }

    onEnable()
    {
        this.schedule(this.requestTask,this.refreshInterval,cc.macro.REPEAT_FOREVER,0)
    }

    onDisable()
    {
        this.unschedule(this.requestTask);
    }

    onShow()
    {
        
    }

    show(list)
    {
        this._list =  list;
        this.onShow();
    }

    get list(): Task[] {
        return this._list
    }
}