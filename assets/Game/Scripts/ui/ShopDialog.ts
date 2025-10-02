import ShopItemTemplate from "./ShopItemTemplate";
import SpriteFrameCache from "../../../framework/plugin_boosts/misc/SpriteFrameCache";
import { R } from "../hex-lines-game/Res";
import Platform from "../../../framework/Platform";
import { UserInfo, ChoiceType } from "../Info";
import { Toast } from "../../../framework/plugin_boosts/ui/ToastManager";
import UIFunctions from "../../../framework/plugin_boosts/ui/UIFunctions";
import Device from "../../../framework/plugin_boosts/gamesys/Device";
import Main from "../Main";
import I18Manager from "../i18n/I18Manager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShopDialog extends cc.Component {
	@property(cc.ScrollView)
	scrollview: cc.ScrollView = null;

	@property(cc.Label)
	freeDiamondLabel: cc.Label = null;

	@property(cc.Button)
	freeDiamondBtn: cc.Button = null;

	onLoad() {
		// this.scrollview
	}

	start() {}

	onShown() {
		// {"id":"1","mini_img":"a1","img":"a2","cost":"100"},
		this.scrollview.showlist(
			(node: cc.Node, data: any, i: number) => {
				// console.log(i,data);
				let item = node.getComponent(ShopItemTemplate);
				item.data = data;
				item.diamondLabel.string = data.cost;
				let isLocked = !UserInfo.isUnlock(data.id);
				item.btnBuyNode.active = isLocked;
				item.maskNode.active = isLocked;
				item.borderNode.color = cc.Color.WHITE;
				item.titleLabel.string = I18Manager.t(
					data.text
				);
				item.selectedFlag.active =
					UserInfo.selectedSkin == data.id;
				item.btnSignal.add(this.click_unlock, this);
				SpriteFrameCache.instance
					.getSpriteFrame(
						"Game/Textures/ThumbBgs/" +
							data.mini_img +
							".jpg"
					)
					.then(
						(sf) =>
							(item.bgmini.spriteFrame =
								sf)
					);
			},
			R.skinConfig.json
		);

		this.refreshBtnStatus();
	}

	refreshBtnStatus() {
		if (g.isNextDay(UserInfo.shopFreeDiamondTime)) {
			this.freeDiamondLabel.string =
				I18Manager.t("free_get_50");
			UIFunctions.setButtonEnabled(this.freeDiamondBtn, true);
		} else {
			this.freeDiamondLabel.string =
				I18Manager.t("already_claimed");
			UIFunctions.setButtonEnabled(
				this.freeDiamondBtn,
				false
			);
		}
	}

	click_close() {}

	share_succ() {
		UserInfo.addDiamond(50);
		UserInfo.shopFreeDiamondTime = new Date().getTime();
		UserInfo.save();
		this.refreshBtnStatus();
	}

	click_free() {
		let choice = UserInfo.getChoice(ChoiceType.Shop);
		if (choice == 1) {
			Platform.share(this.share_succ, this);
		} else if (choice == 0) {
			this.share_succ();
		} else {
			//video
			Platform.watch_video(this.share_succ, this);
		}
	}

	selectBg(data) {
		UserInfo.selectedSkin = data.id;
		UserInfo.save();
		this.onShown();
	}

	click_unlock(data) {
		if (UserInfo.isUnlock(data.id)) {
			//select
			this.selectBg(data);
			Toast.make(
				I18Manager.t("selected").replace(
					"%s",
					I18Manager.t(data.text)
				)
			);
			return;
		}
		if (UserInfo.diamond >= data.cost) {
			UserInfo.diamond -= data.cost;
			UserInfo.unlock(data.id);
			this.selectBg(data);
			Toast.make(
				I18Manager.t("unlocked").replace(
					"%s",
					I18Manager.t(data.text)
				)
			);
			Device.playEffect(R.audio_unlock);
			if (Main.instance) Main.instance.refreshRedpoints();
		} else {
			Toast.make(I18Manager.t("insufficient_diamonds"));
			Device.playEffect(R.audio_invalid);
		}
	}
}
