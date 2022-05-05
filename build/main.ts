function NotifyExpiration() {

  console.info("[Get property 'TARGET_SPREADSHEET_ID']");
  const targetSpreadFileID = PropertiesService.getScriptProperties().getProperty('TARGET_SPREADSHEET_ID');
  if(targetSpreadFileID === null){
    const msg = `Cannot get property 'TARGET_SPREADSHEET_ID'`;
    console.error(msg);
    throw TypeError(msg);
  }else{
    console.log(`targetSpreadFileID: ${targetSpreadFileID}`)
  }
  console.info("Succeeded to get property 'TARGET_SPREADSHEET_ID'");

  console.info("[Get property 'TARGET_SHEET_NAME'");
  const targetSheetName = PropertiesService.getScriptProperties().getProperty('TARGET_SHEET_NAME');
  if (targetSheetName === null) {
    const msg = `Cannot get property 'TARGET_SHEET_NAME'`;
    console.error(msg);
    throw TypeError(msg);
  }else{
    console.log(`targetSheetName: ${targetSheetName}`);
  }
  console.info("Succeeded to get 'TARGET_SHEET_NAME'");

  console.info("[Get sheet object]");
  const spreadApp = SpreadsheetApp.openById(targetSpreadFileID);
  const targetSheet = spreadApp.getSheetByName(targetSheetName);
  if (targetSheet === null) {
    const msg = `Cannot get sheet '${targetSheetName}'`;
    console.error(msg);
    throw TypeError(msg);
  }
  console.info("Succeeded to get sheet object");

  //最終行を取得
  const lastRow = targetSheet.getLastRow();
  console.log(`Last row: ${lastRow}`)
  //今の時刻を取得
  const now = new Date();
  console.log(`now: ${now}`);

  //1行目(タイトル行)を除く2行目から最終行に対してチェックを実行
  for (let i = 2; i <= lastRow; i++) {
    const expirationName : string = targetSheet.getRange(i, 1, 1, 1).getValue();
    console.log(`expirationName: ${expirationName}`);
    const expirationTime : Date = new Date(targetSheet.getRange(i, 2, 1, 1).getValue());
    console.log(`expirationTime: ${expirationTime}`);
    const alertHourFroms : number[] = targetSheet.getRange(i, 3, 1, 1).getValue().toString().split(',');
    console.log(`alertHourFroms: ${alertHourFroms}`);
    const alertTargets : string[] = targetSheet.getRange(i, 4, 1, 1).getValue().toString().split(',');
    console.log(`alertTargets: ${alertTargets}`);
    const comment : string[] = targetSheet.getRange(i, 5, 1, 1).getValue().toString().split(',');
    console.log(`expirationName: ${expirationName}`);

    // 1列目の管理対象名が未指定の場合は実行しない
    if (expirationName.trim().length == 0) {
      console.log(`line ${i} didn't processed because name(column1) isn't specified.`);
      return;
    }

    //今日から有効期限までの残り時間(h)を計算
    const hoursLeft = Math.round((expirationTime.getTime() - now.getTime()) / (1000 * 60 * 60));

    //有効期限の通知前時間が今の場合にメール通知する(1時間おきに起動される想定)
    let sent = false
    for (const alertHourFrom of alertHourFroms) {
      if (hoursLeft == alertHourFrom) {
        sendMessage(alertTargets, `${expirationName}の期限があと${Math.round(hoursLeft)}時間です\n${comment}`);
        console.log(`Message for '${expirationName}' sent because hours left: ${hoursLeft}`);
        sent = true;
        break;
      }
    }
    if (!sent) {
      console.log(`Message for '${expirationName}' didn't sent because hours left: ${hoursLeft}`);
    }




    console.log(`NotifyExpiration done for row: ${i}`);
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