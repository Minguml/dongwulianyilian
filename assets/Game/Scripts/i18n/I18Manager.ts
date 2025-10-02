const { ccclass } = cc._decorator;

@ccclass
export default class I18Manager {
	private static readonly LANGUAGE_STORAGE_KEY =
		"game_language_preference";
	private static _currentLang: string = "vi";
	private static _dict: { [key: string]: string } = {};
	private static _isInitialized: boolean = false;

	/** Initialize with default language */
	public static async init(): Promise<void> {
		if (!this._isInitialized) {
			// Load saved language preference or use default
			const savedLang = this.getSavedLanguage();
			await this.setLanguage(savedLang || this._currentLang);
			this._isInitialized = true;
		}
	}

	/** Load translation JSON for a language */
	public static async setLanguage(lang: string): Promise<void> {
		return new Promise((resolve, reject) => {
			cc.loader.loadRes(
				`Game/i18n/${lang}`,
				cc.JsonAsset,
				(err, asset: cc.JsonAsset) => {
					if (err) {
						cc.error(
							`[i18n] Failed to load language '${lang}'`,
							err
						);
						reject(err);
						return;
					}
					this._dict = asset.json;
					this._currentLang = lang;
					cc.director.emit("language-changed");
					resolve();
				}
			);
		});
	}

	/** Translate a key */
	public static t(key: string): string {
		if (this._dict && this._dict[key]) {
			return this._dict[key];
		}
		console.warn(`[i18n] Missing translation for key: ${key}`);
		return key; // fallback
	}

	public static get currentLang(): string {
		return this._currentLang;
	}

	/** Get list of available languages */
	public static getAvailableLanguages(): string[] {
		return ["en", "vi", "zh"];
	}

	/** Change language at runtime */
	public static async changeLanguage(lang: string): Promise<void> {
		await this.setLanguage(lang);
		this.saveLanguagePreference(lang);
	}

	/** Save language preference to localStorage */
	private static saveLanguagePreference(lang: string): void {
		try {
			if (
				cc.sys.isBrowser &&
				typeof localStorage !== "undefined"
			) {
				localStorage.setItem(
					this.LANGUAGE_STORAGE_KEY,
					lang
				);
			}
		} catch (error) {
			console.warn(
				"[i18n] Failed to save language preference:",
				error
			);
		}
	}

	/** Get saved language preference from localStorage */
	private static getSavedLanguage(): string | null {
		try {
			if (
				cc.sys.isBrowser &&
				typeof localStorage !== "undefined"
			) {
				return localStorage.getItem(
					this.LANGUAGE_STORAGE_KEY
				);
			}
		} catch (error) {
			console.warn(
				"[i18n] Failed to load language preference:",
				error
			);
		}
		return null;
	}

	/** Clear saved language preference from localStorage */
	public static clearLanguagePreference(): void {
		try {
			if (
				cc.sys.isBrowser &&
				typeof localStorage !== "undefined"
			) {
				localStorage.removeItem(
					this.LANGUAGE_STORAGE_KEY
				);
			}
		} catch (error) {
			console.warn(
				"[i18n] Failed to clear language preference:",
				error
			);
		}
	}
}
