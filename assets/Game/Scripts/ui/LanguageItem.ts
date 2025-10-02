import I18Manager from "../i18n/I18Manager";
import ViewManager from "../../../framework/plugin_boosts/ui/ViewManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LanguageItem extends cc.Component {
	@property(cc.Label)
	languageLabel: cc.Label = null;

	@property(cc.Node)
	selectedIndicator: cc.Node = null; // Optional: checkmark or highlight

	private languageCode: string = "";
	private callback: (lang: string) => void = null;

	init(
		languageCode: string,
		displayName: string,
		isSelected: boolean,
		callback: (lang: string) => void
	) {
		this.languageCode = languageCode;
		this.languageLabel.string = displayName;
		this.callback = callback;

		if (this.selectedIndicator) {
			this.selectedIndicator.active = isSelected;
		}
	}

	onLanguageClick() {
		if (this.callback) {
			this.callback(this.languageCode);
		}

		// Close the language dialog after selection
		this.closeLanguageDialog();
	}

	private closeLanguageDialog() {
		// Use ViewManager to properly close the dialog
		// This will handle the modal background cleanup
		ViewManager.instance.hide("Game/LanguageDialog");
	}
}
