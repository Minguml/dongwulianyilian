import I18Manager from "../i18n/I18Manager";
import ViewManager from "../../../framework/plugin_boosts/ui/ViewManager";
import LanguageItem from "./LanguageItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LanguageDialog extends cc.Component {
	@property(cc.ScrollView)
	scrollView: cc.ScrollView = null;

	@property(cc.Prefab)
	languageItemPrefab: cc.Prefab = null;

	@property(cc.Layout)
	layout: cc.Node = null;

	private languageOptions = [
		{ code: "en", name: "English" },
		{ code: "vi", name: "Tiếng Việt" },
		{ code: "zh", name: "中文" },
	];

	onLoad() {
		console.log("LanguageDialog onLoad() called");
		this.populateLanguageList();
	}
	populateLanguageList() {
		console.log("Starting to populate language list");
		const content = this.scrollView.content;
		const layout = this.layout;
		const currentLang = I18Manager.currentLang;

		console.log("Content node:", content);
		console.log("Content size:", content.getContentSize());
		console.log("Content position:", content.position);
		console.log(
			"ScrollView size:",
			this.scrollView.node.getContentSize()
		);

		// Clear existing items
		content.removeAllChildren();

		// Add language options
		this.languageOptions.forEach((lang, index) => {
			console.log(`Creating item for ${lang.name}`);
			const item = cc.instantiate(this.languageItemPrefab);
			console.log("Instantiated item:", item);
			console.log(
				"Item size before init:",
				item.getContentSize()
			);

			const itemComponent = item.getComponent(LanguageItem);
			console.log("Item component:", itemComponent);

			const isSelected = lang.code === currentLang;

			itemComponent.init(
				lang.code,
				lang.name,
				isSelected,
				this.onLanguageSelected.bind(this)
			);

			console.log(
				"Item size after init:",
				item.getContentSize()
			);
			console.log("Item position:", item.position);

			content.addChild(item);

			console.log(`Added ${lang.name} to content`);
			console.log(
				"ScrollView viewport size:",
				this.scrollView.node.getContentSize()
			);
			console.log(
				"ScrollView content size:",
				content.getContentSize()
			);
			console.log(
				"Item local position in content:",
				item.position
			);
			console.log("Content position:", content.position);
		});

		console.log("Content children count:", content.children.length);
		console.log("Final content size:", content.getContentSize());
		this.updateContentSize();
	}

	private updateContentSize() {
		const content = this.scrollView.content;
		const layout = content.getComponent(cc.Layout);

		if (layout) {
			layout.updateLayout();
		} else {
			// Manual size calculation if no Layout component
			const itemHeight = 100; // Adjust based on your item height
			const spacing = 10;
			const totalHeight =
				(itemHeight + spacing) *
				this.languageOptions.length;
			content.height = Math.max(
				totalHeight,
				this.scrollView.node.height
			);
		}
	}

	async onLanguageSelected(languageCode: string) {
		try {
			// Change language
			await I18Manager.changeLanguage(languageCode);

			// Refresh the list to update selection
			this.populateLanguageList();

			// Optionally close dialog after selection
			// ViewManager.instance.hide("Game/LanguageDialog");
		} catch (error) {
			cc.error("Failed to change language:", error);
		}
	}

	onCloseClick() {
		ViewManager.instance.hide("Game/LanguageDialog");
	}
}
