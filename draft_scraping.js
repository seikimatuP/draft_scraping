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
  
  // シートがない場合、新規作成
  if (sheet == null) {
    createSheetAndCart(year, spreadsheet);
    var sheet = spreadsheet.getSheetByName(year);
  }

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

// 年度初めシートがないので作成してグラフやヘッダー追加する
function createSheetAndCart(year) {
  // 新しいシート追加
  createSheet(year);

  // 作成したシートにグラフを追加
  createChart(year);
}

// 年度初めシートがないので作成する
function createSheet(year) {
  // 新しいシート追加
  const sheet = SpreadsheetApp.openById(sheet_id);
  var new_sheet = sheet.insertSheet();
  new_sheet.setName(year);

  // ヘッダー追加
  // A:yyyy高校生_high_school
  new_sheet.getRange(header_range_high_school).setValue(year + header_text_high_school);
  // B:yyyy高校生_name
  new_sheet.getRange(header_range_high_school_name).setValue(year + header_text_high_school_name);
  // C:yyyy高校生_day
  new_sheet.getRange(header_range_high_school_day).setValue(year + header_text_high_school_day);
  // D:yyyy高校生_sum
  new_sheet.getRange(header_range_high_school_sum).setValue(year + header_text_high_school_sum);
  // E:yyyy大学生_university
  new_sheet.getRange(header_range_university).setValue(year + header_text_university);
  // F:yyyy大学生_name
  new_sheet.getRange(header_range_university_name).setValue(year + header_text_university_name);
  // G:yyyy大学生_day
  new_sheet.getRange(header_range_university_day).setValue(year + header_text_university_day);
  // H:yyyy大学生_sum
  new_sheet.getRange(header_range_university_sum).setValue(year + header_text_university_sum);
  // I:id
  new_sheet.getRange(header_range_id).setValue(header_text_id);
  // J:スクリプト実施日
  new_sheet.getRange(header_range_exec_day).setValue(header_text_exec_day);
  // K:高校生
  new_sheet.getRange(header_range_high_school_summary).setValue(header_text_high_school);
  // L:大学生
  new_sheet.getRange(header_range_university_summary).setValue(header_text_university);
  // M:前回比_高校生
  new_sheet.getRange(header_range_high_school_day_over_day).setValue(header_text_high_school_day_over_day);
  // N:前回比_大学生
  new_sheet.getRange(header_range_university_day_over_day).setValue(header_text_university_day_over_day);
}

// グラフの作成 増分グラフ-> M:N 合計グラフ-> K:L列からデータ取得
function createChart(year) {
  const spreadSheet = SpreadsheetApp.openById(sheet_id);
  const sheet = spreadSheet.getSheetByName(year);
  //getRangeでA1からB6列を取得します。
  const range_sum = sheet.getRange('K1:L1006');
  const range_increment = sheet.getRange('M1:N1006');
  //newChartメソッドで、グラフを作成します。addRangeに、先程取得したデータ範囲を設定します。
  const sum_chart = sheet
    .newChart()
    .addRange(range_sum)
    .setChartType(Charts.ChartType.LINE)
    .setPosition(25, 15, 0, 0) //buildメソッドの前に、挿入場所を指定するsetPositionを加えます。
    .setOption('title', sum_chart_title)
    .setOption('useFirstColumnAsDomain', false)
    .setNumHeaders(1)
    .build();
  const increment_chart = sheet
    .newChart()
    .addRange(range_increment)
    .setChartType(Charts.ChartType.LINE)
    .setPosition(1, 15, 0, 0) //buildメソッドの前に、挿入場所を指定するsetPositionを加えます。
    .setOption('title', increment_chart_title)
    .setOption('useFirstColumnAsDomain', false)
    .setNumHeaders(1)
    .build();

  //グラフをシートに挿入します
  sheet.insertChart(sum_chart);
  sheet.insertChart(increment_chart);
}