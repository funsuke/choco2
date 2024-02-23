// ・つりっクラッシュ(ニコ生ゲーム　60秒)
// 　8x8	3種
// 　落ちる速度は深さにかかわらず指定秒(演出はだんだん速くtween操作？)
// 　4つで横→縦イカ、4つ縦で→横イカ、5つで人魚　合成は無し
// ・ズーパズル(ニコ生ゲーム 70秒)
// 　8x7 7種(緑, 橙, 赤, 水, 白, ピ, 黄)？
// 　落ちる速度は深さにかかわらず指定秒(演出は同じ速度でそのままずれる)
// 　特別な仕様なし
// ・ぷよぷよ(アーケード 決着つくまで)
// 　6x12 5種(赤,黄,緑,紫,水) 対戦
// 　落ちる速度は1マス指定秒(試合時間が長くなるほど短くなる)、深くなるほど時間がかかる
// 　連鎖などすることで相手に攻撃
// ・キャンディクラッシュ(スマホゲーム 操作回数制限)
// 　最大9x9?,多種多様なステージ 6種?(赤,橙,黄,水,緑,紫,?)
// 　落ちる速度は1マス指定秒(試合時間が長くなるほど短くなる)、深くなるほど時間がかかる
// 　・スペシャルキャンディ初期3種
// 　　４つ　　ストライプ　１列
// 　　ＬorＴ　ラッピング　周り(3x3?)
// 　　５つ　　カラー　　　同色
// 　　ストｘスト　　　　　十字
// 　　ストｘラプ　　　　　十字３列
// 　　ストｘカラ　　　　　縦or横ライン、色すべてスト変化
// 　　ラプｘラプ　　　　　周り(5x5?)
// 　　ラプｘカラ　　　　　２回カラ
// 　　カラｘカラ　　　　　全て削除
// ・点数計算(消した数*10*(連鎖ボーナス+連結ボーナス+色数ボーナス)) ぷよぷよより
// ・連鎖ボーナス
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
// ・連結ボーナス
//   連結数  倍率
//       3     0
//       4     2
//       5     3
//       6     4
//       7以降、6で固定
// ・色数ボーナス
//   色数  倍率
//      1    0
//      2    3
//      3    6
//      4   12
//      5   24




import { Number } from "./CNumber";
import { Table } from "./CTable";
import { GameMainParameterObject } from "./parameterObject";

const isDebug: boolean = true;

/**
 * メイン
 * @param param メイン用パラメータ
 */
export function main(param: GameMainParameterObject): void {
	// アセットID
	const assetIllust: string[] = ["bg", "choco", "chocola", "area"];
	const assetUI: string[] = ["number_w", "number_p", "alarm", "point",
		"number4", "fukidasi2"];
	const assetPanel: string[] = ["block", "block2", "blk_back", "blk_back2"];
	const assetAnim: string[] = [
		"chocola_anim_b", "chocola_anim_g", "chocola_anim_o", "chocola_anim_r", "chocola_anim_w"
	];
	const assetSE: string[] = [
		"nc301255_C4", "nc301255_D4", "nc301255_E4",
		"nc301255_F4", "nc301255_G4", "nc301255_A4",
		"nc301255_B4", "nc301255_C5", "nc274835", "nc274836"];
	const assetBGM: string[] = ["nc289960"];
	// シーン
	const scene = new g.Scene({
		game: g.game,
		// このシーンで利用するアセットのIDを列挙し、シーンに通知します
		assetIds: [
			...assetIllust,
			...assetUI,
			...assetPanel,
			...assetAnim,
			...assetSE,
			...assetBGM],
	});
	// 時間の設定
	let time = 60; // 制限時間
	if (param.sessionParameter.totalTimeLimit) {
		time = param.sessionParameter.totalTimeLimit; // セッションパラメータで制限時間が指定されたらその値を使用します
	}
	// 市場コンテンツのランキングモードでは、g.game.vars.gameState.score の値をスコアとして扱います
	g.game.vars.gameState = { score: 0 };
	// =============================================================
	// シーン読み込み時処理
	// =============================================================
	scene.onLoad.add(() => {
		/** BGM再生 */
		if (!isDebug) {
			scene.asset.getAudioById("nc289960").play().changeVolume(0.10);
			// スタート音
			scene.asset.getAudioById("nc274835").play();
		}

		/** 背景の生成追加 */
		scene.append(new g.Sprite({ scene, src: scene.asset.getImageById("bg") }));

		/** テーブルクラスの生成 */
		const table = new Table(scene, param.random);
		scene.append(table);

		/** しょこたん */
		scene.append(new g.Sprite({
			scene,
			src: scene.asset.getImageById("choco"),
			x: g.game.width - 500,
			y: g.game.height - 550,
		}));

		/** ショコラ */
		scene.append(new g.Sprite({
			scene,
			src: scene.asset.getImageById("chocola"),
			x: g.game.width - 275,
			y: g.game.height - 280,
		}));

		/** 絵：アラーム */
		scene.append(new g.Sprite({
			scene,
			src: scene.asset.getImageById("alarm"),
			anchorX: 1.0,
			x: g.game.width,
		}));
		const numTime = new Number({
			scene,
			assetId: "number_w",
			maxDigit: 3,
			align: "right",
			pitch: 40,
			anchorX: 1.0,
			x: g.game.width - 64,
		});
		scene.append(numTime);

		/** スコア 64x64 */
		scene.append(new g.Sprite({
			scene,
			src: scene.asset.getImageById("point"),
			anchorX: 1.0,
			anchorY: 1.0,
			x: g.game.width,
			y: g.game.height,
		}));
		const numScore = new Number({
			scene: scene,
			assetId: "number_p",
			maxDigit: 10,
			align: "right",
			pitch: 40,
			anchorX: 1.0,
			x: g.game.width - 64,
			y: g.game.height - 64,
		});
		numScore.setNumber(0);
		numScore.onUpdate.add(() => {
			numScore.change();
		});
		scene.append(numScore);

		// scene.setInterval(() => {
		// 	numScore.setNext(numScore.nowScore + Math.floor(1000 * g.game.random.generate()));
		// }, 5000);

		// -------------------------------------------------------------
		// 連鎖
		// -------------------------------------------------------------

		// -------------------------------------------------------------
		// 残り時間
		// -------------------------------------------------------------
		const font = new g.DynamicFont({
			game: g.game,
			fontFamily: "sans-serif",
			size: 48
		});

		// const lbl1: g.Label = new g.Label({
		// 	scene: scene,
		// 	font: font,
		// 	textColor: "black",
		// 	text: "あいうえお",
		// 	width: 300,
		// 	height: 50,
		// 	anchorX: 1.0,
		// 	anchorY: 0.5,
		// 	x: g.game.width,
		// 	y: g.game.height / 2,
		// });
		// scene.append(lbl1);

		// テスト
		scene.onPointDownCapture.add(() => {
			// 制限時間以内であればタッチ1回ごとにSCOREに+1します
			if (time >= 0) {
				g.game.vars.gameState.score++;
			}
		});
		// =============================================================
		// 更新ハンドラと更新処理
		// =============================================================
		const updateHandler = (): void => {
			if (time <= 0) {
				scene.onUpdate.remove(updateHandler); // カウントダウンを止めるためにこのイベントハンドラを削除します
			}
			// カウントダウン処理
			time -= 1 / g.game.fps;
			numTime.setNumber(Math.ceil(time));
		};
		scene.onUpdate.add(updateHandler);
	});
	g.game.pushScene(scene);
}
