/*
■参考ぷよ連鎖得点
https://puyo-euphonic.com/puyo-word-score-calculation

■連鎖
 1			   40
 2   40+(4*  8*10)	  360
 3  360+(4* 16*10)	 1000
 4 1000+(4* 32*10)	 2280
 5 2280+(4* 64*10)	 4840
 6 4840+(4* 96*10)	 8680
 7 8680+(4*128*10)	13800

■1ダブなど
1連鎖1色 4連結 4*1*10			  40
1連鎖1色 5連結 5*2*10			 100
1連鎖1色 6連結 6*3*10			 180

1連鎖2色 4:4連結 8*(0+0+3)*10		 240
1連鎖2色 4:5連結 9*(0+2+3)*10		 450
1連鎖2色 4:6連結 10*(0+3+3)*10		 600

1連鎖2色 5:5連結 10*(0+(2+2)+3)*10	 700
1連鎖2色 5:6連結 11*(0+(2+3)+3)*10	 880

1連鎖2色 6:6連結 12*(0+(3+3)+3)*10	1080

■2ダブ
2連鎖1色 4:4連結 40+(8*(8+0)*10)	 680

2連鎖2色 4:4連結 40+(8*(8+0+3)*10)	 920
2連鎖2色 4:5連結 40+(9*(8+2+3)*10)	1210
2連鎖2色 4:6連結 40+(10*(8+3+3)*10)	1440

2連鎖2色 5:5連結 40+(10*(8+(2+2)+3)*10)	1540
2連鎖2色 5:6連結 40+(11*(8+(2+3)+3)*10)	1800

2連鎖2色 6:6連結 40+(12*(8+(3+3)+3)*10)	2080

■2トリ
2連鎖1色 4:4:4連結 40+(12*(8+0)*10)	1000
2連鎖1色 4:4:5連結 40+(13*(8+2)*10)	1340
2連鎖1色 4:4:6連結 40+(14*(8+3)*10)	1580

2連鎖2色 4:4:4連結 40+(12*(8  +3)*10)	1360
2連鎖2色 4:4:5連結 40+(13*(8+2+3)*10)	1730
2連鎖2色 4:4:6連結 40+(14*(8+3+3)*10)	2000

2連鎖3色 4:4:4連結 40+(12*(8  +6)*10)	1720
2連鎖3色 4:4:5連結 40+(13*(8+2+6)*10)	2120
2連鎖3色 4:4:6連結 40+(14*(8+3+6)*10)	2420
*/
/*
■参考から導き出した得点表
■連鎖
 1										 30
 2    30+(3*  4*10)	  150
 3   150+(3*  8*10)	  390
 4   390+(3* 16*10)	  870
 5   870+(3* 32*10)	 1830
 6  1830+(3* 48*10)	 3270
 7  3270+(3* 64*10)	 5190
 8  5190+(3* 80*10)	 7590
 9  7590+(3* 96*10)	10470
10 10470+(3*112*10)	13830

■1ダブなど ※1回スワップで6連結になる事はあり得ない
1連鎖1色 3連結 3*1*10			  30
1連鎖1色 4連結 4*2*10			  80
1連鎖1色 5連結 5*3*10			 150
1連鎖1色 6連結 6*5*10			 300

1連鎖2色 3:3連結 6*(0+0+3)*10		 180
1連鎖2色 3:4連結 7*(0+2+3)*10		 350
1連鎖2色 3:5連結 8*(0+5+3)*10		 640
1連鎖2色 3:6連結 9*(0+8+3)*10		 990

1連鎖2色 4:4連結  8*(0+(2+2)+3)*10	 560
1連鎖2色 4:5連結  9*(0+(2+5)+3)*10	 900
1連鎖2色 4:6連結 10*(0+(2+8)+3)*10	1300

1連鎖2色 5:5連結 10*(0+(5+5)+3)*10	1300
1連鎖2色 5:6連結 11*(0+(5+8)+3)*10	1760

1連鎖2色 6:6連結 12*(0+(8+8)+3)*10	2280

■2ダブ
2連鎖1色 3:3連結 30+(6*(8+0+0)*10)	 510

2連鎖2色 3:3連結 30+(6*(8+0+3)*10)	 690
2連鎖2色 3:4連結 30+(7*(8+2+3)*10)	 940
2連鎖2色 3:5連結 30+(8*(8+5+3)*10)	1310

2連鎖2色 4:4連結 30+(8*(8+(2+2)+3)*10)	1230
2連鎖2色 4:5連結 30+(9*(8+(2+5)+3)*10)	2080

2連鎖2色 5:5連結 30+(10*(8+(5+5)+3)*10)	2130

■2トリ
2連鎖1色 3:3:3連結 30+( 9*(8+0+0)*10)	 750
2連鎖1色 3:3:4連結 30+(10*(8+2+0)*10)	1340
2連鎖1色 3:3:5連結 30+(11*(8+5+0)*10)	1460

2連鎖2色 3:3:3連結 30+( 9*(8+0+3)*10)	1020
2連鎖2色 3:3:4連結 30+(10*(8+2+3)*10)	1330
2連鎖2色 3:3:5連結 30+(11*(8+5+3)*10)	1790

2連鎖3色 3:3:3連結 30+( 9*(8+0+6)*10)	1290
2連鎖3色 3:3:4連結 30+(10*(8+2+6)*10)	1630
2連鎖3色 3:3:5連結 30+(11*(8+5+6)*10)	2120

*/

// 消した個数×(連鎖ボーナス＋連結ボーナス＋色数ボーナス)×１０
// 全ボーナスが0の場合、1
// ex.)
// ３つ１連鎖	3*(0+0+0)*10= 30		  30
// ３つ２連鎖	3*(4+0+0)*10=120		 150
// ３つ３連鎖 3*(8+0+0)*10=240		 390
// ３つ４連鎖 3*(16)*10=480				 870
// ３つ５連鎖 3*(32)*10=960				1830

// ・連鎖ボーナス
//   連鎖  倍率
//      1    0 1にした方が良い？
//      2    4
//      3    8
//      4   16
//      5   32
//      6   48
//      7   64
//      8   80
//      9   96
//     10  112
//     11  128
//     12  144
//     13  160
//     14  176
//     15  192
//     16  208
//     17  224
//     18  240
//     19  256
//     20以降 256で固定
import { HEIGHT, MARGIN_HN, MARGIN_VT, Panel, PanelColor, PanelState, WIDTH, INPUT_THRESHOLD, DELTA_L, DELTA_T } from './CPanel';
import { ASPECT_RATIO, Random } from "./define";
import { Dir, Input } from './CInput';
import { Number } from './CNumber';

// *****************************
// 定数
// *****************************
// export const COLS: number = 8;
// export const ROWS: number = 7;
// export const ROWS2: number = ROWS * 2;
export const COLS: number = 6;
export const ROWS: number = 6;
export const ROWS2: number = ROWS * 2;

export const ARRAY_SIZE: number = COLS * ROWS2;

export const TABLE_W: number = 692;
export const TABLE_H: number = 559;

// export const TABLE_L: number = 84;
// export const TABLE_T: number = 77;
export const TABLE_L: number = 0;
export const TABLE_T: number = 0;

export const TABLE_Y: number = 120;
export const TABLE_X: number = (g.game.height - (TABLE_Y + TABLE_H)) * ASPECT_RATIO;

export enum TableState {
	stopping = 0,
	erasing = 1,
	falling = 2,
	waiting = 3,		// 1回しか通らない処理後ステータス変化を待つときに使用
}

// export interface MovePanel {
// 	idxSrc: number;
// 	idxDst: number;
// 	handlersSrc?: g.TriggerHandler<g.PointDownEvent>[];
// 	handlersDst?: g.TriggerHandler<g.PointDownEvent>[];
// 	dir: Dir;
// }

// *************************************************************
// 得点計算用テーブル
// *************************************************************
// ボーナス：連鎖
//   連鎖  倍率
//      1    0
//      2    4
//      3    8
//      4   16
//      5   32
//      6   48
//      7   64
//      8   80
//      9   96
//     10  112
//     11  128
//     12  144
//     13  160
//     14  176
//     15  192
//     16  208
//     17  224
//     18  240
//     19  256
//     20以降 256で固定
const TableCombo: number[] = [
	0, 4, 8, 16,
	32, 48, 64, 80,
	96, 112, 128, 144,
	160, 176, 192, 208,
	224, 240, 256, 256
];

// ボーナス：連結ボーナス
//   連結数  倍率
//       3     0
//       4     2
//       5     5
//       6     8
const TableChain: number[] = [
	0, 0, 0, 0, 2, 5, 8
];

// ボーナス：同時消去色数
//   色数  倍率
//      1    0	0
//      2    3	3*1
//      3    6	3*2
//      4   12	3*2*2
//      5   24	3*2*2*2
const TableColor: number[] = [
	0, 0, 3, 6, 12, 24
];

/**
 * テーブルクラス
 */
export class Table extends g.E {
	// シーン
	public scene: g.Scene;
	// テーブル状態
	public tState: TableState;
	// 入力パネル
	public input: Input;
	// 背景
	private back: g.Sprite;
	// パネル配列
	private panels: Panel[] = new Array<Panel>();
	// ランダムクラス
	private random: Random;
	// 選択用
	private rectSelected: g.FilledRect;
	// 消去用配列
	private eraseArray: number[] = new Array<number>(ROWS * COLS);
	// コンボ(連鎖用)
	private combo: number = 0;
	// 点数用
	private score: Number;

	/**
	 * 行と列からパネル配列のインデックスを取得する
	 * @param row 行
	 * @param col 列
	 * @returns 
	 */
	static getIdxToRowCol(row: number, col: number): number {
		return col + COLS * row;
	}

	/**
	 * テーブルクラスの生成
	 * @param param
	 */
	constructor(scene: g.Scene, random: g.RandomGenerator, _score: Number) {
		super({ scene, x: TABLE_L, y: TABLE_T, });
		// シーン
		this.scene = scene;
		// テーブル状態
		this.tState = TableState.waiting;
		// ランダムクラス
		this.random = new Random(random);
		// スコア
		this.score = _score;
		// 入力値
		this.input = new Input();
		// 背景の追加
		this.back = new g.Sprite({
			scene: scene,
			src: scene.asset.getImageById("blk_back2"),
			touchable: true,
		});
		this.append(this.makeBack(scene));
		// ペインの追加
		const pane: g.Pane = this.makePane(scene);
		// パネルの追加
		this.makePanels(scene);
		// パネルイベントの追加
		this.addEvent(scene);
		// 消去配列の初期化 ※ES6ではArray.prototype.fill()使えず
		for (let i = 0; i < this.eraseArray.length; i++) {
			this.eraseArray[i] = 0;
		}
		// 選択用四角
		this.rectSelected = new g.FilledRect({
			scene: scene,
			cssColor: "white",
			width: WIDTH,
			height: HEIGHT,
			anchorX: 0.5,
			anchorY: 0.5,
			opacity: 0.8,
			hidden: true,
		});
		pane.append(this.rectSelected);
		// ペインにパネルを追加する
		this.appendPanels(pane);
		this.append(pane);
	}

	public getCombo(): number {
		return this.combo;
	}

	/**
	 * イベント追加
	 * @param {g.Scene} scene シーン
	 */
	private addEvent(scene: g.Scene): void {
		let flgTest2: boolean = true;
		let isCalcPoint: boolean = true;
		// =============================================================
		// 更新時処理
		// =============================================================
		this.onUpdate.add(() => {
			let shouldChanging: boolean = true;
			switch (this.tState) {
				/** 停止状態 */
				case TableState.stopping:
					// 補充処理
					this.panelFilling();
					// 消去用配列のセット・あればtrue
					if (this.checkErase()) {
						console.log("消去処理に入ります");
						this.tState = TableState.erasing;
					} else {
						/** 連鎖の終了 */
						this.combo = 0;
						this.tState = TableState.waiting;
					}
					break;
				/** 消去処理状態 */
				case TableState.erasing:
					// 得点計算
					if (isCalcPoint) {
						const point = this.calcPoint();
						console.log("取得ポイント：" + point);
						this.score.setNext(this.score.nowScore + point);
						this.debug();
						switch (this.combo) {
							case 1:
								this.scene.asset.getAudioById("nc301255_C4").play();
								break;
							case 2:
								this.scene.asset.getAudioById("nc301255_D4").play();
								break;
							case 3:
								this.scene.asset.getAudioById("nc301255_E4").play();
								break;
							case 4:
								this.scene.asset.getAudioById("nc301255_F4").play();
								break;
							case 5:
								this.scene.asset.getAudioById("nc301255_G4").play();
								break;
							case 6:
								this.scene.asset.getAudioById("nc301255_A4").play();
								break;
							case 7:
								this.scene.asset.getAudioById("nc301255_B4").play();
								break;
							default:
								this.scene.asset.getAudioById("nc302159").play();
								break;
						}
						this.scene.asset.getAudioById("nc184298").play().changeVolume(0.8);
						isCalcPoint = false;
					}
					// 消去アニメーション
					shouldChanging = true;
					for (let c = 0; c < COLS; c++) {
						let flgErasing: boolean = false;
						for (let r = 0; r < ROWS2; r++) {
							const i = Table.getIdxToRowCol(r, c);
							if (r < ROWS) {
								// 消すブロックがある場合
								if (this.eraseArray[i] & 7) {
									flgErasing = true;
									// 消去配列の消去
									this.eraseArray[i] = 0;
									// 画像の消去
									this.panels[i].animErase(shouldChanging);
									shouldChanging = false;
								}
							}
							if (flgErasing) {
								this.panels[i].pState = PanelState.falling;
							}
						}
					}
					this.tState = TableState.waiting;
					break;
				/** 落下処理 */
				case TableState.falling:
					isCalcPoint = true;
					console.log("落ちる処理に来ました");
					shouldChanging = true;
					for (let c = 0; c < COLS; c++) {
						let cntSpace = 0;
						for (let r = 0; r < ROWS2; r++) {
							const i = Table.getIdxToRowCol(r, c);
							//
							if (this.panels[i].frameNumber === PanelColor.none) {
								this.panels[i].pState = PanelState.falling;
								cntSpace++;
							} else {
								if (cntSpace > 0) {
									let j = i;
									for (; Panel.getRowToIdx(j) > 0 && this.panels[j - COLS].frameNumber === 0; j -= COLS) {
										this.dataSwap(j, j - COLS);
										this.panels[j].y = Panel.getYToIdx(j) + MARGIN_VT / 2;
									}
									this.panels[j].animFall(cntSpace, shouldChanging);
									shouldChanging = false;
								}
							}
						}
						// 補充処理
						// for (let r = ROWS2 - 1; r >= ROWS2 - cntSpace; r--) {
						// 	const i = Table.getIdxToRowCol(r, c);
						// 	this.panels[i].frameNumber = this.random.randRange(1, PanelColor.colors + 1);
						// 	this.panels[i].modified();
						// }
					}
					this.tState = TableState.waiting;
					break;
				/** 待機処理 */
				case TableState.waiting:
					break;
			}
		}, this);
		// =============================================================
		// 押下時処理
		// =============================================================
		this.onPointDown.add((ev: g.PointDownEvent) => {
			this.debug();
		});
	}

	/**
	 * 充填処理
	 */
	private panelFilling(): void {
		for (let c = 0; c < COLS; c++) {
			for (let r = ROWS2 - 1; r >= ROWS; r--) {
				const i = Table.getIdxToRowCol(r, c);
				if (this.panels[i].frameNumber === PanelColor.none) {
					this.panels[i].frameNumber = this.random.randRange(1, PanelColor.colors + 1);
					this.panels[i].modified();
					this.panels[i].pState = PanelState.stopping;
				} else {
					break;
				}
			}
		}
	}

	/**
	 * 点数計算
	 */
	private calcPoint(): number {
		console.log("得点計算********************************");
		// 消去配列の探査
		let erase: number = 0;		// 消した数
		let chain: number = 0;		// 連結ボーナス数
		let bitColor: number = 0;		// 同時消しした色数(bit)
		this.eraseArray.forEach((v) => {
			erase += (v & 7) ? 1 : 0;
			chain += TableChain[(v & 0o70) >> 3];
			chain += TableChain[(v & 0o700) >> 6];
			bitColor |= v > 0 ? 1 << (v & 7) - 1 : 0;
		});
		console.log("ビット色：" + bitColor);
		// 色数の取得
		let color: number = 0;
		for (; bitColor != 0; bitColor &= bitColor - 1) {
			color++;
		}
		//
		let bonus: number = 0;
		if (erase > 0) {
			this.combo++;
			console.log(`消し[${erase}],ボ連[${TableCombo[this.combo - 1]}],ボ結[${chain}],ボ色[${TableColor[color]}]`)
			// ボーナスの計算
			bonus = TableCombo[this.combo - 1] + chain + TableColor[color];
			bonus = (bonus === 0) ? 1 : bonus;
		}
		return erase * 10 * bonus;
	}

	public isFalling(): boolean {
		let retValue: boolean = false;
		for (let i = 0; i < ROWS * COLS; i++) {
			if (this.panels[i].pState === PanelState.falling) {
				retValue = true;
				break;
			}
		}
		return retValue;
	}

	private checkErase(): boolean {
		let retValue: boolean = false;
		let number: number = 0;		// 消えるブロック数
		let chain: number = 0;		// 連結数 同色がいくつ繋がったか
		// 消去配列の初期化 ※ES6ではArray.prototype.fill()使えず
		// this.eraseArray.forEach((v, i) => { this.eraseArray[i] = 0; });
		for (let i = 0; i < this.eraseArray.length; i++) {
			this.eraseArray[i] = 0;
		}
		// 横の連結
		let idx: number = 0;
		for (let row = 0; row < ROWS; row++) {
			for (let col = 0; col < COLS - 2; col++) {
				idx = Table.getIdxToRowCol(row, col);
				if (Panel.getColToIdx(idx) >= COLS - 2) continue;
				const color = this.panels[idx].frameNumber;
				chain = 1;
				let idx2 = idx + 1;
				for (; this.panels[idx2].frameNumber === color; idx2++) {
					chain++;
					if (Panel.getColToIdx(idx2) === COLS - 1) {
						idx2++;
						break;
					}
				}
				if (chain >= 3) {
					retValue = true;
					for (let i = idx2 - 1; i >= idx; i--) {
						this.eraseArray[i] |= color;
					}
					this.eraseArray[idx] |= chain << 3;
					col += chain - 1;
				}
			}
		}
		// 縦の連結
		for (let col = 0; col < COLS; col++) {
			for (let row = 0; row < ROWS - 2; row++) {
				idx = Table.getIdxToRowCol(row, col);
				const color = this.panels[idx].frameNumber;
				chain = 1;
				let idx2 = idx + COLS;
				for (; this.panels[idx2].frameNumber === color; idx2 += COLS) {
					chain++;
					if (Panel.getRowToIdx(idx2) === ROWS - 1) {
						idx2 += COLS;
						break;
					}
				}
				if (chain >= 3) {
					retValue = true;
					for (let i = idx2 - COLS; i >= idx; i -= COLS) {
						this.eraseArray[i] |= color;
					}
					this.eraseArray[idx] |= chain << 6;
					row += chain - 1;
				}
			}
		}
		return retValue;
	}

	private isNormalInput(input: Input): boolean {
		return (
			input.srcIdx >= 0 && input.srcIdx < ROWS * COLS &&
			input.dstIdx >= 0 && input.dstIdx < ROWS * COLS
		);
	}

	private canMovePanels(input: Input): boolean {
		return (
			this.canMovePanel(input.srcIdx) && this.canMovePanel(input.dstIdx)
		);
	}

	private canMovePanel(idx: number): boolean {
		return (
			this.panels[idx].pState === PanelState.stopping &&
			this.panels[idx].frameNumber !== PanelColor.none
		);
	}

	public dataSwap(src: number, dst: number): void {
		// スワップ
		[this.panels[src], this.panels[dst]] = [this.panels[dst], this.panels[src]];
	}

	/**
	 * ペインにパネルを追加する
	 * @param pane 追加されるペイン
	 */
	private appendPanels(pane: g.Pane): void {
		for (let c = 0; c < COLS; c++) {
			for (let r = ROWS2 - 1; r >= 0; r--) {
				const idx: number = Table.getIdxToRowCol(r, c);
				pane.append(this.panels[idx]);
			}
		}
	}

	/**
	 * パネル配列の生成
	 * @param scene シーン
	 */
	private makePanels(scene: g.Scene): void {
		for (let i = 0; i < ARRAY_SIZE; i++) {
			let left: number[] = [0, 0];
			let down: number[] = [0, 0];
			// 行列の設定
			const row = Panel.getRowToIdx(i);
			const col = Panel.getColToIdx(i);
			// 3列目以降の処理
			if (col >= 2) {
				left[0] = this.panels[i - 1].frameNumber;
				left[1] = this.panels[i - 2].frameNumber;
			}
			// 3行目以降の処理
			if (row >= 2) {
				down[0] = this.panels[i - COLS].frameNumber;
				down[1] = this.panels[i - COLS * 2].frameNumber;
			}
			// 新規ブロックの設定
			let newColor: PanelColor = this.getRndPColor();
			if (left[0] === left[1] || down[0] === down[1]) {
				while (newColor === left[0] || newColor === down[0]) {
					newColor = this.getRndPColor();
				}
			}
			this.panels[i] = this.makePanel(scene, newColor, i);
			// イベント
			// this.panels[i].onPointDown.add((ev: g.PointDownEvent) => {
			// 	this.rectSelected.x = this.panels[i].x - DELTA_L;
			// 	this.rectSelected.y = this.panels[i].y - DELTA_T;
			// 	this.rectSelected.show();
			// 	this.rectSelected.modified();
			// });
			// this.panels[i].onPointUp.add((ev: g.PointUpEvent) => {
			// 	this.rectSelected.hide();
			// });
		}
	}
	/**
	 * パネル背景の生成
	 * @param scene シーン
	 * @returns 画像描画エンティティ
	 */
	private makeBack(scene: g.Scene): g.Sprite {
		// =============================================================
		// 押上時処理
		// =============================================================
		this.back.onPointUp.add((ev: g.PointUpEvent) => {
			this.rectSelected.hide();
		}, this);
		// =============================================================
		// 押下時処理
		// =============================================================
		this.back.onPointDown.add((ev: g.PointDownEvent) => {
			// 入力移動元の初期化
			this.input.src = { idx: -1, row: -1, col: -1 };
			// 入力移動元の設定
			const col = Math.floor((ev.point.x - DELTA_L) / MARGIN_HN);
			const row = ROWS - 1 - Math.floor((ev.point.y - DELTA_T) / MARGIN_VT);
			if (col >= 0 && col < COLS && row >= 0 && row < ROWS) {
				const idx = Table.getIdxToRowCol(row, col);
				if (idx >= 0 && idx < ROWS * COLS) {
					if (this.canMovePanel(idx)) {
						this.input.src = { idx, row, col };
					}
				}
				// 選択用四角
				this.rectSelected.x = Panel.getXToIdx(idx) + WIDTH / 2;
				this.rectSelected.y = Panel.getYToIdx(idx) + HEIGHT / 2;
				this.rectSelected.show();
				this.rectSelected.modified();
			}
		}, this);
		// =============================================================
		// 移動時処理
		// =============================================================
		this.back.onPointMove.add((ev: g.PointMoveEvent) => {
			// 入力移動先の初期化
			this.input.dst = { idx: -1, row: -1, col: -1 };
			// 入力移動先の設定
			if (this.input.srcIdx != -1) {
				if (Math.abs(ev.startDelta.x) >= Math.abs(ev.startDelta.y)) {
					if (Math.abs(ev.startDelta.x) >= INPUT_THRESHOLD) {
						if (ev.startDelta.x >= INPUT_THRESHOLD && this.input.srcCol < COLS - 1) {
							// 右に入力され、一番右端ではない場合
							if (this.canMovePanel(this.input.srcIdx + 1)) {
								this.input.dstToDir(Dir.right);
							}
						} else if (ev.startDelta.x <= -INPUT_THRESHOLD && this.input.srcCol > 0) {
							// 左に入力され、一番左端ではない場合
							if (this.canMovePanel(this.input.srcIdx - 1)) {
								this.input.dstToDir(Dir.left);
							}
						} else {
							console.log("横入力エラー： x:" + ev.startDelta.x + ", sCol:" + this.input.srcCol);
						}
					}
				} else if (Math.abs(ev.startDelta.y) >= INPUT_THRESHOLD) {
					if (ev.startDelta.y >= INPUT_THRESHOLD && this.input.srcRow > 0) {
						// 下に入力され、一番下端ではない場合
						if (this.canMovePanel(this.input.srcIdx - COLS)) {
							this.input.dstToDir(Dir.down);
						}
					} else if (ev.startDelta.y <= -INPUT_THRESHOLD && this.input.srcRow < ROWS - 1) {
						// 上に入力され、一番上端ではない場合
						if (this.canMovePanel(this.input.srcIdx + COLS)) {
							this.input.dstToDir(Dir.up);
						}
					} else {
						console.log("縦入力エラー： y:" + ev.startDelta.y + ", sRow:" + this.input.srcRow);
					}
				} else {
					console.log("入力エラー：INPUT＿THRESHOLD以下 startDelta(" + ev.startDelta.x + "," + ev.startDelta.y + ")");
				}
				// 状態の更新
				if (this.input.dstIdx != -1) {
					// 入力があり(成立する)、２つが動かせる場合
					if (this.isNormalInput(this.input) && this.canMovePanels(this.input)) {
						// 移動先パネルのアニメーション
						this.panels[this.input.srcIdx].animSwap(this.input, this.input.dir, false);
						// 移動元パネルのアニメーション 向きを反転させて処理
						this.panels[this.input.dstIdx].animSwap(this.input, this.input.dirInvert, true);
					}
					// 入力をリセット
					this.input.reset();
				}
			}
		}, this);
		return this.back;
	}

	/**
	 * ペインエンティティの生成
	 * @param scene シーン
	 * @returns ペインエンティティ
	 */
	private makePane(scene: g.Scene): g.Pane {
		return new g.Pane({
			scene: scene,
			width: MARGIN_HN * COLS,
			height: MARGIN_VT * ROWS,
			x: 12,
			y: 12,
		});
	}
	/**
	 * パネルエンティティの生成
	 * @param scene シーン
	 * @param color 色
	 * @param idx パネル配列の添え字
	 * @returns パネルエンティティ
	 */
	private makePanel(scene: g.Scene, color: number, idx: number): Panel {
		return new Panel({
			scene: scene,
			// src: scene.asset.getImageById("block"),
			src: scene.asset.getImageById("block2"),
			width: WIDTH,
			height: HEIGHT,
			frames: [0, 1, 2, 3, 4, 5],
			frameNumber: color,
			// touchable: true,
			anchorX: 0.5,
			anchorY: 0.5,
			x: WIDTH / 2 + Panel.getXToIdx(idx),
			y: HEIGHT / 2 + Panel.getYToIdx(idx),
			index: idx,
			table: this,
		});
	}
	/**
	 * ランダムなパネルの色を返す
	 * @returns {typBlockType}
	 */
	private getRndPColor(): PanelColor {
		return this.random.randRange(0, PanelColor.colors) + 1;
	}

	public debug(): void {
		let s: string = "";
		const cState: string[] = ["停止", "交換", "落下", "消去"];
		const cDir: string[] = ["無", "→", "↓", "", "←", "", "", "", "↑"];
		const cColor: string[] = ["無", "青", "緑", "橙", "赤", "白"];
		console.log("デバッグ************************");
		console.log(`状態：${cState[this.tState]}`);
		console.log(`入力：(${this.input.srcIdx},${this.input.dstIdx})`)
		console.log("色：");
		for (let i = 0; i < ROWS * COLS; i++) {
			s += `${("0" + i).slice(-2)}:${cColor[this.panels[i].frameNumber]}, `;
			if (i % COLS === COLS - 1) {
				console.log(s);
				s = "";
			}
		}
		console.log("座標：");
		for (let i = 0; i < ROWS2 * COLS; i++) {
			s += `${("00" + i).slice(-3)}: (${("0" + this.panels[i].x.toString(16)).slice(-2)},${("00" + this.panels[i].y.toString(16)).slice(-3)}), `;
			if (i % COLS === COLS - 1) {
				console.log(s);
				s = "";
			}
		};
		console.log("消去配列：");
		for (let i = 0; i < ROWS * COLS; i++) {
			s += `[${("0" + i).slice(-2)}]:${("00" + this.eraseArray[i].toString(8)).slice(-3)} `;
			if (i % COLS === COLS - 1) {
				console.log(s);
				s = "";
			}
		}
		console.log("********************************");
	}
}
