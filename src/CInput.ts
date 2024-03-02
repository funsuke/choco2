import { COLS, ROWS } from "./CTable";

/**
 * 方向の定数
 */
export enum Dir {
	none = 0,
	right = 1,
	down = 2,
	left = 4,
	up = 8,
};

export interface PanelInfo {
	idx: number;
	row: number;
	col: number;
}

export interface InputInfo {
	src: PanelInfo,
	dst: PanelInfo,
	dir: number;
}

export class Input {

	private input: InputInfo;

	/**
	 * コンストラクタ
	 */
	constructor() {
		// 初期化
		this.input = {
			src: { idx: -1, row: -1, col: -1 },
			dst: { idx: -1, row: -1, col: -1 },
			dir: Dir.none,
		};
	}

	get srcIdx(): number {
		return this.input.src.idx;
	}

	get srcRow(): number {
		return this.input.src.row;
	}

	get srcCol(): number {
		return this.input.src.col;
	}

	get dstIdx(): number {
		return this.input.dst.idx;
	}
	get dstRow(): number {
		return this.input.dst.row;
	}

	get dstCol(): number {
		return this.input.dst.col;
	}

	get dir(): number {
		return this.input.dir;
	}

	get dirInvert(): number {
		return (this.input.dir << 2) % 15;
	}

	/**
	 * 移動元パネルの設定
	 */
	set src(panel: PanelInfo) {
		this.input.src = panel;
		// 移動先があれば方向を設定する
		if (this.containsTableDstIdx()) {
			this.setDir();
		}
	}

	/**
	 * 移動先パネルの設定
	 */
	set dst(panel: PanelInfo) {
		this.input.dst = panel;
		// 移動元があれば方向を設定する
		if (this.containsTableSrcIdx()) {
			this.setDir();
		}
	}

	public dstToDir(dir: Dir): void {
		if (dir !== Dir.none && this.input.src.idx !== -1) {
			// this.dst.idx = this.src.idx + (dir & 0b101) ? 1 - 2 * Number(dir === Dir.left): 
			this.input.dir = dir;
			switch (dir) {
				case Dir.right:
					this.input.dst.idx = this.input.src.idx + 1;
					this.input.dst.row = this.input.src.row;
					this.input.dst.col = this.input.src.col + 1;
					break;
				case Dir.left:
					this.input.dst.idx = this.input.src.idx - 1;
					this.input.dst.row = this.input.src.row;
					this.input.dst.col = this.input.src.col - 1;
					break;
				case Dir.down:
					this.input.dst.idx = this.input.src.idx - COLS;
					this.input.dst.row = this.input.src.row - 1;
					this.input.dst.col = this.input.src.col;
					break;
				case Dir.up:
					this.input.dst.idx = this.input.src.idx + COLS;
					this.input.dst.row = this.input.src.row + 1;
					this.input.dst.col = this.input.src.col;
					break;
			}
		}
	}

	/**
	 * 方向を設定する
	 */
	private setDir(): void {
		// 移動先と移動元がテーブルに存在する場合
		if (this.containsTableSrcIdx() && this.containsTableDstIdx()) {
			// 方向を設定する
			switch (this.dst.idx) {
				case this.src.idx + 1:
					this.input.dir = Dir.right;
					break;
				case this.src.idx - 1:
					this.input.dir = Dir.left;
					break;
				case this.src.idx - COLS:
					this.input.dir = Dir.down;
					break;
				case this.src.idx + COLS:
					this.input.dir = Dir.up;
					break;
				default:
					this.input.dir = Dir.none;
			}
		} else {
			this.input.dir = Dir.none;
		}
	}

	/**
	 * 移動元パネルが表示テーブルに存在するか
	 * @returns {boolean} true: 移動元パネルがテーブルにある
	 */
	private containsTableSrcIdx(): boolean {
		return (this.input.src.idx >= 0 && this.input.src.idx < ROWS * COLS);
	}

	/**
	 * 移動先パネルが表示テーブルに存在するか
	 * @returns {boolean} true: 移動先パネルがテーブルにある
	 */
	private containsTableDstIdx(): boolean {
		return (this.input.dst.idx >= 0 && this.input.dst.idx < ROWS * COLS);
	}

	/**
	 * リセット
	 */
	public reset(): void {
		this.input = {
			src: { idx: -1, row: -1, col: -1 },
			dst: { idx: -1, row: -1, col: -1 },
			dir: Dir.none,
		};
	}
}
