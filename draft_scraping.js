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
const body = 'プロ志望届スクレイピング終わった \n https://docs.google.com/spreadsheets/d/1LZeh2tO-S3YMwmqDUSSc9furSXYiE6j4XasdlETQepA/edit#gid=1176042870';

const set_trigger_function_name = 'player_list_update';

const set_hour = 17;
const set_minutes = 20;
const set_seconds = 00;

function high_school_player(year) {
  var html = UrlFetchApp.fetch(high_school_url).getContentText('sjis');
  
  var list = Parser.data(html).from('<tr>').to('</tr>').iterate();
  var spreadsheet = SpreadsheetApp.openById(sheet_id);
  // シート1をスポーツに命名(スポーツニュースのみに絞ってスクレイピング)
  var sheet = spreadsheet.getSheetByName(year);
  var lastrow = 2;
  
  for(var i = 4; list.length > i; i++){
    //都道府県,学校名,名前,志望届提出日の順で選手情報入ってる
    var player_info = Parser.data(list[i]).from('<td>').to('</td>').iterate();
    
    if(player_info[2].search('※') == -1){
      //学校名(都道府県名)
      sheet.getRange(high_school_name + lastrow).setValue(player_info[1] + '(' + player_info[0] + ')');
      //名前
      sheet.getRange(high_school_player_name + lastrow).setValue(player_info[2]);
      //志望届提出日
      sheet.getRange(high_school_filing_date + lastrow).setValue(player_info[3]);
      
      lastrow++;
    }
  }
  return lastrow-2;
}

function university_player(year) {
  var html = UrlFetchApp.fetch(university_url).getContentText();
  var list = Parser.data(html).from('<tr align="center" bgcolor="#ffffff">').to('</tr>').iterate();
  var spreadsheet = SpreadsheetApp.openById(sheet_id);
  var lastrow = 2;
  
  // シート1をスポーツに命名(スポーツニュースのみに絞ってスクレイピング)
  var sheet = spreadsheet.getSheetByName(year);
  for(var i = 0; list.length > i; i++){
    //都道府県,学校名,名前,志望届提出日の順で選手情報入ってる
    var temp = Parser.data(list[i]).from('<td>').to('</td>').iterate();
    var player_info = [];
    
    for(var t = 1; temp.length > t; t++){
      var info = Parser.data(temp[t]).from('<font color="#000000">').to('</font>').iterate();
      player_info.push(info);
    }
    
    if(player_info[0] != '<font color="#000000">'){
      //学校名
      sheet.getRange(university_name + lastrow).setValue(player_info[0]);
      //名前
      sheet.getRange(university_player_name + lastrow).setValue(player_info[1] + '(' + player_info[2] + ')');
      //志望届提出日
      sheet.getRange(university_filing_date + lastrow).setValue(player_info[3]);
      
      lastrow++;
    }
  }
  return lastrow-2;
}

// トリガー作成、志望届リスト更新、スクリプト実行結果記載メソッド
function player_list_update(){
  var date = new Date();
  // 年を取得
  const year = Utilities.formatDate( date, 'Asia/Tokyo', 'yyyy');
  //トリガー作成
  if (setTrigger_flg) {
    setTrigger(set_trigger_function_name);
  }
  
  var spreadsheet = SpreadsheetApp.openById(sheet_id);
  var sheet = spreadsheet.getSheetByName(year);
  
  //A1セルから[Ctrl + ↓]
  var lastRow = sheet.getRange(sheet.getMaxRows(), 9).getNextDataCell(SpreadsheetApp.Direction.UP).getRow() + 1;
  if (university_players_flg || high_school_players_flg){
    //スクリプト実施日のid
    sheet.getRange(exec_script_id + lastRow).setValue(lastRow-1);
    // 今日の日付を表示
    const today = Utilities.formatDate( date, 'Asia/Tokyo', 'yyyy/MM/dd');
    // スクリプト実施日
    sheet.getRange(exec_script_filing_date + lastRow).setValue(today);  
  }

  if(high_school_players_flg){
    const high_school_players = high_school_player(year);
    // 高校生人数
    sheet.getRange(count_high_school_player + lastRow).setValue(high_school_players);
    sheet.getRange(count_high_school_player_filing_date + count_row).setValue(high_school_players);
    if(lastRow > 3){
      // 高校生人数_前日比
      sheet.getRange(high_school_player_dat_over_day + (lastRow - 1)).copyTo(sheet.getRange(high_school_player_dat_over_day + lastRow));
    }
  }

  if(university_players_flg){
    const university_players = university_player(year);
    // 大学生人数
    sheet.getRange(count_university_player + lastRow).setValue(university_players);
    sheet.getRange(count_university_player_filing_date + count_row).setValue(university_players);
    if(lastRow > 3){
      // 大学生人数_前日比
      sheet.getRange(university_player_dat_over_day + (lastRow - 1)).copyTo(sheet.getRange(university_player_dat_over_day + lastRow));
    }
  }
  if(university_players_flg || high_school_players_flg){
    sendMail();
  }
}

// トリガー作成 今のところ、平日のみ実行するようにトリガー設定
function setTrigger(functionName) {
 var setTime = new Date();
 setTime.setDate(setTime.getDate() + 1);
 
 var condition = 1; 
 if(condition){
   if (isBusinessDay(setTime)){
     setTime.setDate(setTime.getDate())
   }else {
     setTime.setDate(setTime.getDate() + 2);
   }
   setTime.setHours(set_hour);
   setTime.setMinutes(set_minutes);
   setTime.setSeconds(set_seconds);
   ScriptApp.newTrigger(functionName).timeBased().at(setTime).create();
 }
}

// 平日ならtrueを返す
function isBusinessDay(date){
  //土曜日(6)または日曜日(0)
  if (date.getDay() == 0 || date.getDay() == 6) {
    return false;
  }
  const calJa = CalendarApp.getCalendarById('ja.japanese#holiday@group.v.calendar.google.com');
  if(calJa.getEventsForDay(date).length > 0){
    return false;
  }
  return true;
}

function sendMail(){
  const options = {from: recipient}; //送信元メールアドレス
  GmailApp.sendEmail(recipient, subject, body, options);
}

