import TableRowController from "./TableRowController"; // adjust path
import I18Manager from "../i18n/I18Manager";
import { UserInfo } from "../Info";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TableController extends cc.Component {
	@property(cc.ScrollView)
	scrollView: cc.ScrollView = null;

	@property(cc.Prefab)
	itemPrefab: cc.Prefab = null;

	@property({
		displayName: "User Record Highlight Color",
		tooltip: "Color to highlight the user's record in the table",
	})
	userRecordColor: cc.Color = cc.Color.RED;

	private apiUrl: string =
		"https://5d820f171c8ff70014ef438d.mockapi.io/1/ranking-list";

	onLoad() {
		this.fetchData();
	}

	async fetchData() {
		try {
			const response = await fetch(this.apiUrl);
			const data = await response.json();

			const userRecord = {
				rank: undefined,
				name: I18Manager.t("you"),
				level: UserInfo.level,
			};

			data.push(userRecord);

			data.sort((a, b) => b.level - a.level);

			data.forEach((item, index) => {
				item.rank = index + 1;
			});

			this.populateTable(data.slice(0, 10));
		} catch (err) {
			cc.error("API fetch failed:", err);
		}
	}

	populateTable(data: any[]) {
		const content = this.scrollView.content;
		content.removeAllChildren();

		data.forEach((item) => {
			const newItem = cc.instantiate(this.itemPrefab);
			content.addChild(newItem);

			const row = newItem.getComponent(TableRowController);
			if (row) {
				row.setData(item);

				// Check if this is the user's record and highlight it
				if (this.isUserRecord(item)) {
					this.highlightUserRecord(row);
				}
			}
		});
	}

	private isUserRecord(item: any): boolean {
		// Check if this is the user's record by comparing name and level
		return (
			item.name === I18Manager.t("you") &&
			item.level === UserInfo.level
		);
	}

	private highlightUserRecord(row: TableRowController) {
		// Use the configurable highlight color for the user's record
		const highlightColor = this.userRecordColor;

		if (row.rankLabel) {
			row.rankLabel.node.color = highlightColor;
		}
		if (row.nameLabel) {
			row.nameLabel.node.color = highlightColor;
		}
		if (row.levelLabel) {
			row.levelLabel.node.color = highlightColor;
		}
	}
}
