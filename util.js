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

// A:yyyy高校生_high_school
const header_range_high_school = 'A1';
const header_text_high_school = '高校生_high_school';
// B:yyyy高校生_name
const header_range_high_school_name = 'B1';
const header_text_high_school_name = '高校生_name';
// C:yyyy高校生_day
const header_range_high_school_day = 'C1';
const header_text_high_school_day = '高校生_day';
// D:yyyy高校生_sum
const header_range_high_school_sum = 'D1';
const header_text_high_school_sum = '高校生_sum';
// E:yyyy大学生_university
const header_range_university = 'E1';
const header_text_university = '大学生_university';
// F:yyyy大学生_name
const header_range_university_name = 'F1';
const header_text_university_name = '大学生_name';
// G:yyyy大学生_day
const header_range_university_day = 'G1';
const header_text_university_day = '大学生_day';
// H:yyyy大学生_sum
const header_range_university_sum = 'H1';
const header_text_university_sum = '大学生_sum';
// I:id
const header_range_id = 'I1';
const header_text_id = 'id';
// J:スクリプト実施日
const header_range_exec_day = 'J1';
const header_text_exec_day = 'スクリプト実施日';
// K:高校生
const header_range_high_school_summary = 'K1';
// L:大学生
const header_range_university_summary = 'L1';
// M:前回比_高校生
const header_range_high_school_day_over_day = 'M1';
const header_text_high_school_day_over_day = '前回比_高校生';
// N:前回比_大学生
const header_range_university_day_over_day = 'N1';
const header_text_university_day_over_day = '前回比_大学生';

const sum_chart_title = 'カテゴリー別プロ志望届提出者推移';
const increment_chart_title = 'カテゴリー別プロ志望届提出者の増分';
