import I18Manager from "../i18n/I18Manager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LocalizedLabel extends cc.Component {
	@property
	key: string = ""; // translation key

	private label: cc.Label | null = null;

	async onLoad() {
		this.label = this.getComponent(cc.Label);

		// Ensure I18Manager is initialized
		await I18Manager.init();
		this.updateLabel();

		// Listen to language change events
		cc.director.on("language-changed", this.updateLabel, this);
	}

	private updateLabel = () => {
		if (this.label && this.key) {
			this.label.string = I18Manager.t(this.key);
			console.log(
				`Updated label with key '${this.key}': '${this.label.string}'`
			);
		}
	};

	onDestroy() {
		cc.director.off("language-changed", this.updateLabel, this);
	}
}
