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
  const spreadApp = SpreadsheetApp.openById(targetSpreadFileID);
  const targetSheet = spreadApp.getSheetByName(targetSheetName);

  //今の時刻を取得
  const now = new Date();
 
  //対象行のデータを取得
  const expirationName = targetSheet.getRange(targetRow, 1, 1, 1).getValue();
  const expirationTime = new Date(targetSheet.getRange(targetRow, 2, 1, 1).getValue());
  const alertHourFroms = targetSheet.getRange(targetRow, 3, 1, 1).getValue().toString().split(',');
  const alertTargets = targetSheet.getRange(targetRow, 4, 1, 1).getValue().toString().split(',');
  const comment = targetSheet.getRange(targetRow, 5, 1, 1).getValue().toString().split(',');
  
  // 1列目の管理対象名が未指定の場合は実行しない
  if(expirationName.trim().length == 0){
    console.log(`line ${targetRow} didn't processed because name(column1) isn't specified.`);
    return;
  }

  //今日から有効期限までの残り時間(h)を計算
  const hoursLeft = Math.round((expirationTime.getTime()-now.getTime())/(1000 * 60 * 60));
  
  //有効期限の通知前時間が今の場合にメール通知する(1時間おきに起動される想定)
  let sent = false
  for(const alertHourFrom of alertHourFroms){    
    if(hoursLeft == alertHourFrom){
      sendMessage(alertTargets, `${expirationName}の期限があと${Math.round(hoursLeft)}時間です\n${comment}`);
      console.log(`Message for '${expirationName}' sent because hours left: ${hoursLeft}`);
      sent = true;
      break;
    }
  }
  if(!sent){
    console.log(`Message for '${expirationName}' didn't sent because hours left: ${hoursLeft}`);
  }
}

function callerForAllRow() {

  const targetSpreadFileID = PropertiesService.getScriptProperties().getProperty('TARGET_SPREADSHEET_ID');
  const targetSheetName = PropertiesService.getScriptProperties().getProperty('TARGET_SHEET_NAME');
  
  //対象シートを取得
  const spreadApp = SpreadsheetApp.openById(targetSpreadFileID);
  const targetSheet = spreadApp.getSheetByName(targetSheetName);

  //最終行を取得
  const lastRow = targetSheet.getLastRow();
  console.log(`Last row: ${lastRow}`)
  
  //1行目(タイトル行)を除く2行目から最終行に対してチェックを実行
  for(let i=2; i<=lastRow; i++){
    NotifyExpiration(targetSpreadFileID, targetSheetName, i);
    console.log(`NotifyExpiration done for row: ${i}`);
  }
}

function sendMessage(alertTargets, message) {
  //Line Notifyのトークン
  const lineTokenFamily = PropertiesService.getScriptProperties().getProperty('lineTokenFamily');
  const lineTokenDebug = PropertiesService.getScriptProperties().getProperty('lineTokenDebug');

  let lineToken;
  for(const alertTarget of alertTargets){
    if(alertTarget == "家族"){
      lineToken = lineTokenFamily;
    }else{
      lineToken = lineTokenDebug;
    }

    const options =
    {
      "method"  : "post",
      "payload" : "message=" + message,
      "headers" : {"Authorization" : "Bearer "+ lineToken}
    };

    UrlFetchApp.fetch("https://notify-api.line.me/api/notify",options);
    console.log(`Message sent.`);
  }
}