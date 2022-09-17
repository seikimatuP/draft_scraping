const high_school_url = 'https://www.jhbf.or.jp/pro-aspiring/2022.html';
const university_url = 'https://www.jubf.net/system/prog/procandidate.php?kind=all&year=2022';

// シートの指定．GoogleスプレッドシートのURLの「https://docs.google.com/spreadsheets/d/***************************************/edit#gid=0」の部分を使う．
const sheet_id = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
// 最終行を取得　別シートで定義
// 固定定数
const count_row = 2;

//高校名の列
const high_school_name = 'A'
//高校生の名前の列
const high_school_player_name = 'B'
//志望届提出日の列
const high_school_filing_date = 'C'

//大学名の列
const university_name = 'E'
//大学生の名前の列
const university_player_name = 'F'
//志望届提出日の列
const university_filing_date = 'G'

//スクリプト実施日のid
const exec_script_id = 'I'
// スクリプト実施日
const exec_script_filing_date = 'J'

//高校生の人数の列
const count_high_school_player = 'K'
//高校生の人数の列
const count_high_school_player_filing_date = 'D'
//高校生の人数前日比の列
const high_school_player_dat_over_day = 'M'
//大学生の人数の列
const count_university_player = 'L'
//大学生の人数の列
const count_university_player_filing_date = 'H'
//大学生の人数前日比の列
const university_player_dat_over_day = 'N'

//志望届リスト更新メソッドの実行フラグを定数定義
const university_players_flg = 1;
const high_school_players_flg = 1;
const setTrigger_flg = 1;

//メール送信に使う定数
const recipient = 'example@email.com';
const subject = 'プロ志望届 実行';
const body = 'プロ志望届スクレイピング終わった \n シートのURL';

const set_trigger_function_name = 'player_list_update';

const set_hour = 17;
const set_minutes = 20;
const set_seconds = 00;