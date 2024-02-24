import tl = require("@akashic-extension/akashic-timeline");

// ---------------------------------------------
// パネル用定数
// ---------------------------------------------
import { COLS, ROWS, TABLE_L, TABLE_T, Table, TableState } from "./CTable";
import { Easing } from "@akashic-extension/akashic-timeline";
import { Dir, Input } from "./CInput";

// 大きさ
// export const WIDTH: number = 112;
// export const HEIGHT: number = 91;
export const WIDTH: number = 128;
export const HEIGHT: number = 116;
// 配置の余白
// export const MARGIN_HN: number = 84;
// export const MARGIN_VT: number = 77;
export const MARGIN_HN: number = 128;
export const MARGIN_VT: number = 116;
// 入力閾値
export const INPUT_THRESHOLD: number = 50;
// 移動値
export const DELTA_L: number = 5;
export const DELTA_T: number = 2;

// パネル用状態定数
export enum PanelState {
	stopping = 1,
	initSwapping = 2,
	swapping = 3,
	falling = 4,
};

// 色
export enum PanelColor {
	none = 0,
	blue = 1,
	green = 2,
	orange = 3,
	red = 4,
	white = 5,
	colors = 5,
}

/**
 * パネルコンストラクタ用のパラメータ
 */
export interface PanelParameterObject extends g.FrameSpriteParameterObject {
	index: number;
	table: Table;		/** テーブルオブジェクト(状態変数を参照したいため) */
}

/**
 * パネルクラス
 */
export class Panel extends g.FrameSprite {
	/** パネル状態 */
	public pState: PanelState;
	/** インデックス */
	public index: number;
	/** テーブルオブジェクト(状態変数を参照したいため) */
	private table: Table;
	/**
	 * パネル配列の添え字から行を取得する
	 * @param idx パネル配列の添え字
	 */
	static getRowToIdx(idx: number): number {
		return Math.floor(idx / COLS);
	}
	/**
	 * パネル配列の添え字から列を取得する
	 * @param idx パネル配列の添え字
	 * @returns 列
	 */
	static getColToIdx(idx: number): number {
		return idx % COLS;
	}
	/**
	 * 配列の添え字から横位置を取得する
	 * @param idx パネル配列の添え字
	 * @returns 横位置
	 */
	static getXToIdx(idx: number): number {
		// return MARGIN_HN * Panel.getIdxToCol(idx) - 8;
		return DELTA_L + MARGIN_HN * Panel.getColToIdx(idx);
	}
	/**
	 * 配列の添え字から縦位置を取得する
	 * @param idx パネル配列の添え字
	 * @returns 縦位置
	 */
	static getYToIdx(idx: number): number {
		// return MARGIN_VT * (ROWS - 1 - Panel.getIdxToRow(idx)) - 4;
		return DELTA_T + MARGIN_VT * (ROWS - 1 - Panel.getRowToIdx(idx));
	}
	/**
	 * パネルコンストラクタ
	 * @param params
	 */
	constructor(params: PanelParameterObject) {
		super(params);
		/**  パネル状態：停止 */
		this.pState = PanelState.stopping;
		/** インデックス */
		this.index = params.index;
		/** テーブルオブジェクト */
		this.table = params.table;
		/** 入力イベントの追加 */
		this.addEvent();
	}
	// インデックス
	// get Index(): number { return this._index; }
	// set Index(i: number) { this._index = i; }
	// 入力方向
	// public getInputDir(): Dir { return this.inputDir; }
	// 入れ替えアニメーション
	public animSwap(input: Input, dir: Dir, shouldChanging: boolean = true): void {
		console.log("Panel::animation");
		console.log(`    src = ${input.srcIdx}`);
		console.log(`    dst = ${input.dstIdx}`);
		console.log(`    dir = ${dir}`);
		/** 状態の更新 */
		this.pState = PanelState.swapping;
		/** 移動距離の設定 */
		let dx: number = 0;
		let dy: number = 0;
		switch (dir) {
			case Dir.right:
				dx = MARGIN_HN;
				break;
			case Dir.down:
				dy = MARGIN_VT
				break;
			case Dir.left:
				dx = -MARGIN_HN;
				break;
			case Dir.up:
				dy = -MARGIN_VT;
				break;
		}
		/** タイムライン */
		this.makeSwapTimeline(dx, dy, shouldChanging);
		// this.index = input.dstIdx;
	}

	public animErase(): void {
		// const x = TABLE_L + Panel.getXToIdx(this.index);
		// const y = TABLE_T + Panel.getYToIdx(this.index);
		// console.log(x);
		// console.log(y);
		let asset: g.ImageAsset;
		switch (this.frameNumber) {
			case PanelColor.blue:
				asset = this.scene.asset.getImageById("chocola_anim_b");
				break;
			case PanelColor.green:
				asset = this.scene.asset.getImageById("chocola_anim_g");
				break;
			case PanelColor.orange:
				asset = this.scene.asset.getImageById("chocola_anim_o");
				break;
			case PanelColor.red:
				asset = this.scene.asset.getImageById("chocola_anim_r");
				break;
			case PanelColor.white:
				asset = this.scene.asset.getImageById("chocola_anim_w");
				break;
			default:
				asset = this.scene.asset.getImageById("chocola_anim_b");
		}
		// 一旦消す
		this.frameNumber = 0;
		this.modified();
		// アニメーション設定
		const animErasePanel = new g.FrameSprite({
			scene: this.scene,
			src: asset,
			width: 192,
			height: 192,
			frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
			frameNumber: 0,
			anchorX: 0.5,
			anchorY: 0.5,
			x: TABLE_L + DELTA_L * 2 + this.x,
			y: TABLE_T + DELTA_T * 2 + this.y,
			loop: false,
		});
		animErasePanel.start();
		animErasePanel.onFinish.add(() => {
			animErasePanel.destroy();
			this.table.tState = TableState.falling;
		});
		this.scene.append(animErasePanel);
	}

	/**
	 * 落ちるアニメーション
	 * @param {number} fallNum 落ちる個数
	 */
	public animFall(fallNum: number): void {
		this.pState = PanelState.falling;
		const y = MARGIN_VT * fallNum;
		new tl.Timeline(this.scene).create(this)
			.moveBy(0, y, 500, Easing.easeOutQuint)
			.call(() => {
				this.pState = PanelState.stopping;
				this.table.tState = TableState.stopping;
			});
	}
	/**
	 * 指定の位置に移動するタイムラインを作成
	 * @param dx X移動距離
	 * @param dy Y移動距離
	 */
	private makeSwapTimeline(dx: number, dy: number, shouldChanging: boolean = true): void {
		new tl.Timeline(this.scene).create(this)
			.moveBy(dx, dy, 333, Easing.easeInOutBack)
			.call(() => {
				this.pState = PanelState.stopping;
				if (shouldChanging) {
					this.table.tState = TableState.stopping;
					this.table.input
				}
			});
	}
	/**
	 * ドラッグ入力イベントの追加
	 */
	private addEvent(): void {
		// debug
		this.onPointDown.add((ev: g.PointDownEvent) => {
			console.log("Panel::onPointDown");
			this.debug();
		});
		// =============================================================
		// 更新イベント
		// =============================================================
		this.onUpdate.add(() => {
			// switch (this.pState) {
			// 	case PanelState.stopping:
			// 		break
			// 	case PanelState.initSwapping:
			// 		break;
			// 	case PanelState.swapping:
			// 		break;
			// 	case PanelState.falling:
			// 		break;
			// }
		});
		// =============================================================
		// 移動イベント
		// =============================================================
		this.onPointMove.add((ev: g.PointMoveEvent) => {
			// /** 停止状態かつ色がある場合 */
			// if (this.pState === PanelState.stopping && this.frameNumber !== PanelColor.none) {
			// 	/** XorY方向に閾値以上動いた場合 */
			// 	if ((Math.abs(ev.startDelta.x) >= INPUT_THRESHOLD || Math.abs(ev.startDelta.y) >= INPUT_THRESHOLD)) {
			// 		this.setInputDir(ev);
			// 	}
			// }
		});
	}

	// private pointDownFunc(ev: g.PointMoveEvent) {
	// 	/** 停止状態かつ色がある場合 */
	// 	if (this.pState === PanelState.stopping && this.frameNumber !== PanelColor.none) {
	// 		/** XorY方向に閾値以上動いた場合 */
	// 		if ((Math.abs(ev.startDelta.x) >= INPUT_THRESHOLD || Math.abs(ev.startDelta.y) >= INPUT_THRESHOLD)) {
	// 			this.setInputDir(ev);
	// 		}
	// 	}
	// }

	/**
	 * 方向の設定
	 * @param ev ポインティング操作イベント
	 */
	// private setInputDir(ev: g.PointMoveEvent) {
	// 	console.log("Panel::setInputDir");
	// 	console.log(`    index=${this.index}`);
	// 	// 
	// 	const input = this.table.input;
	// 	input.reset();
	// 	//
	// 	const r: number = Panel.getRowToIdx(this.index);
	// 	const c: number = Panel.getColToIdx(this.index);
	// 	/** 横優先で入力処理 */
	// 	if (Math.abs(ev.startDelta.x) > Math.abs(ev.startDelta.y)) {
	// 		/** 左or右入力 */
	// 		if (ev.startDelta.x <= -INPUT_THRESHOLD && c > 0) {
	// 			input.dir = Dir.left;
	// 			input.idxDst = this.index - 1;
	// 		} else if (ev.startDelta.x >= INPUT_THRESHOLD && c < COLS - 1) {
	// 			input.dir = Dir.right;
	// 			input.idxDst = this.index + 1;
	// 		}
	// 	} else {
	// 		/** 下or上入力 */
	// 		if (ev.startDelta.y >= INPUT_THRESHOLD && r > 0) {
	// 			input.dir = Dir.down;
	// 			input.idxDst = this.index - COLS;
	// 		} else if (ev.startDelta.y <= -INPUT_THRESHOLD && r < ROWS - 1) {
	// 			input.dir = Dir.up;
	// 			input.idxDst = this.index + COLS;
	// 		}
	// 	}
	// 	console.log(`    dir=${input.dir}`);
	// 	/** ステート更新 */
	// 	if (input.dir !== Dir.none && input.idxDst !== -1) {
	// 		this.pState = PanelState.initSwapping;
	// 		/** テーブル変数 */
	// 		this.table.tState = TableState.swapping;
	// 		this.table.input.idxSrc = this.index;
	// 	}
	// }

	private debug() {
		const cColor: string[] = ["無", "青", "緑", "橙", "赤", "白"];
		const cState: string[] = ["", "停止", "init", "スワ", "落下"];
		console.log(`    idx=${this.index}`);
		console.log(`    色 =${cColor[this.frameNumber]}`);
		console.log(`    sta=${cState[this.pState]}`)
	}
}
