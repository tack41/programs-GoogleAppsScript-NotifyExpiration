/*
 * シートに記載されている期限をメールにて通知します。
 * シートは以下のフォーマットで記載させていることが前提です。
 * A列: 名称, B列: 有効期限, C列: 通知先メールアドレス, D列: 通知日数
 * @param targetSheetFileID: 対象スプレッドシートファイルのID
 * @param targetSheetname: 対象スプレッドシートファイル内の対象シートの名前
 * @param targetSheetRow: 何行目の設定を利用するか
 */
function NotifyExpiration(targetSpreadFileID, targetSheetName, targetRow) {

  //対象シートを取得
  var spreadApp = SpreadsheetApp.openById(targetSpreadFileID);
  var targetSheet = spreadApp.getSheetByName(targetSheetName);

  //今の時刻を取得
  var now = new Date();
 
  //対象行のデータを取得
  var expirationName = targetSheet.getRange(targetRow, 1, 1, 1).getValue();
  var expirationTime = new Date(targetSheet.getRange(targetRow, 2, 1, 1).getValue());
  var alertHourFroms = targetSheet.getRange(targetRow, 3, 1, 1).getValue().toString().split(',');
  
  //今日から有効期限までの残り時間(h)を計算
  var hoursLeft = Math.round((expirationTime.getTime()-now.getTime())/(1000 * 60 * 60));
  
  //有効期限の通知前時間が今の場合にメール通知する(1時間おきに起動される想定)
  for(const alertHourFrom of alertHourFroms){    
    if(hoursLeft == alertHourFrom){
      sendMessage(expirationName + 'の期限があと' + Math.round(hoursLeft) + '時間です')
    }
  }
}

function callerForAllRow() {

  var targetSpreadFileID = PropertiesService.getScriptProperties().getProperty('TARGET_SPREADSHEET_ID');
  var targetSheetName = PropertiesService.getScriptProperties().getProperty('TARGET_SHEET_NAME');
  
  //対象シートを取得
  var spreadApp = SpreadsheetApp.openById(targetSpreadFileID);
  var targetSheet = spreadApp.getSheetByName(targetSheetName);

  //最終行を取得
  var lastRow = targetSheet.getLastRow();
  
  var expired = 0;
  //1行目(タイトル行)を除く2行目から最終行に対してチェックを実行
  for(var i=2; i<=lastRow; i++){
    NotifyExpiration(targetSpreadFileID, targetSheetName, i)
  }
}

function sendMessage(message) {
  //Line Notifyのトークン
  var lineTokenFamily = PropertiesService.getScriptProperties().getProperty('lineTokenFamily')
  var lineTokenDebug = PropertiesService.getScriptProperties().getProperty('lineTokenDebug')

  var options =
   {
     "method"  : "post",
     "payload" : "message=" + message,
     "headers" : {"Authorization" : "Bearer "+ lineTokenDebug}
   };

   UrlFetchApp.fetch("https://notify-api.line.me/api/notify",options);
}