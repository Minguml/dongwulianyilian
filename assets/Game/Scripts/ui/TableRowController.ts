const { ccclass, property } = cc._decorator;

@ccclass
export default class TableRowController extends cc.Component {
	@property(cc.Label)
	rankLabel: cc.Label = null;

	@property(cc.Label)
	nameLabel: cc.Label = null;

	@property(cc.Label)
	levelLabel: cc.Label = null;

	setData(data: any) {
		this.rankLabel.string = data.rank.toString();
		this.nameLabel.string = data.name;
		this.levelLabel.string = data.level.toString();
	}
}
