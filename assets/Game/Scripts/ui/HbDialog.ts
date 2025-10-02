import Platform from "../../../framework/Platform";
import LuckyDialog from "./LuckyDialog";
import ViewManager from "../../../framework/plugin_boosts/ui/ViewManager";
import { Toast } from "../../../framework/plugin_boosts/ui/ToastManager";
import { R } from "../hex-lines-game/Res";
import { UserInfo, ChoiceType } from "../Info";
import Device from "../../../framework/plugin_boosts/gamesys/Device";
import View from "../../../framework/plugin_boosts/ui/View";
import I18Manager from "../i18n/I18Manager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HbDialog extends cc.Component {
	onLoad() {}
	start() {}
	click() {
		let choise = UserInfo.getChoice(ChoiceType.HB);
		if (choise == 1) {
			Platform.share(this.share_suc, this);
		} else {
			Platform.watch_video(this.share_suc, this);
		}
	}

	share_suc() {
		let cfg = R.skinConfig.json[3];
		Toast.make(
			I18Manager.t("congratulations_skin").replace(
				"%s",
				I18Manager.t(cfg.text)
			)
		);
		Device.playEffect(R.audio_unlock);
		UserInfo.unlock(cfg.id);
		UserInfo.selectedSkin = cfg.id;
		UserInfo.save();
		ViewManager.instance.show("Game/ShopDialog");
		this.getComponent(View).hide();
	}
}
