/*
 * シートに記載されている期限をメールにて通知します。
 * シートは以下のフォーマットで記載させていることが前提です。
 * A列: 名称, B列: 有効期限, C列: 通知先メールアドレス, D列: 通知日数, E列:備考
 * @return true: メール通知対象だった, false: 対象ではなかった
*/
function NotifyExpiration(expirationName, expirationDate, mailTos, alertDays, remarks) {
  
  let retVal = false;

  //今日から有効期限までの残り日数を計算
  const today = new Date(); 
  const daysLeft = (expirationDate.getTime()-today.getTime())/(1000 * 60 * 60 * 24);
  console.log(`daysLeft: ${daysLeft}`);

  //有効期限の通知日数前が今日の場合にメール通知する
  if(daysLeft <= alertDays){
    retVal = true;
    const mailSubject = expirationName + 'の有効期限通知(あと' + Math.round(daysLeft) + '日)';
    let mailBody = expirationName + 'の有効期限があと ' + Math.round(daysLeft) + ' 日(' + Utilities.formatDate(expirationDate, 'Asia/Tokyo', 'yyyy/M/d') + ')です。\n';
    if(remarks.length > 0){
      mailBody += `\n${remarks}`;
    }

    for(var i in mailTos){
      SendMail(mailTos[i], mailSubject, mailBody);
    }
  }
  
  return retVal;
}

function callerForAllRow() {
  //対象シートを取得
  const targetSpreadsheetID = PropertiesService.getScriptProperties().getProperty('TARGET_SPREADSHEET_ID');
  if(targetSpreadsheetID === null){
      throw new TypeError(`Cannot get Property named 'TARGET_SPREADSHEET_ID'`);
  }
  console.log(`Spreadsheet ID: ${targetSpreadsheetID}`);
  const spreadApp = SpreadsheetApp.openById(targetSpreadsheetID);
  const targetSheetName = PropertiesService.getScriptProperties().getProperty('TARGET_SHEET_NAME');
  if(targetSheetName === null){
      throw new TypeError(`Cannot get Property named 'TARGET_SHEET_NAME'`);
  }
  console.log(`TargetSheet name: ${targetSheetName}`);
  const targetSheet = spreadApp.getSheetByName(targetSheetName);
  if(targetSheet === null){
    throw new TypeError(`Cannot get spreadsheet named '${targetSheetName}'`);
  }

  //メール通知先
  const mailTo = PropertiesService.getScriptProperties().getProperty('MAIL_TO');
  console.log(`Mail to: ${mailTo}`);

  //最終行を取得
  const lastRow = targetSheet.getLastRow();
  console.log(`Last row: ${lastRow}`);

  //1行目(タイトル行)を除く2行目から最終行に対してチェックを実行
  for(let iRow=2; iRow<=lastRow; iRow++){
    console.log(`target row: ${iRow}`);

    //対象行のデータを取得
    let expirationName = targetSheet.getRange(iRow, 1, 1, 1).getValue();
    const expirationDate = new Date(targetSheet.getRange(iRow, 2, 1, 1).getValue());
    let mailTos = targetSheet.getRange(iRow, 3, 1, 1).getValue().toString().split(',');
    const alertDays = targetSheet.getRange(iRow, 4, 1, 1).getValue();
    let remarks = targetSheet.getRange(iRow, 5, 1, 1).getValue();
  
    //型チェック
    if(typeof expirationName != 'string'){
      console.warn(`Type of cell(${iRow},1) is not string: ${expirationName}, ${typeof expirationName}`);
      expirationName = expirationName.toString();
    }
    if(Object.prototype.toString.call(expirationDate) != '[object Date]'){
      console.error(`Type of cell(${iRow},2) is not Date: ${expirationDate}, ${Object.prototype.toString.call(expirationDate)}`);
      return;
    }
    if(typeof alertDays != 'number'){
      console.error(`Type of cell (${iRow},4) is not number: ${alertDays}, ${typeof alertDays}`);
      return;
    }
    if(typeof remarks != 'string'){
      console.warn(`Type of cell(${iRow},5) is not string: ${remarks}, ${typeof remarks}`);
      remarks = remarks.toString();
    }

    if(NotifyExpiration(expirationName, expirationDate, mailTos, alertDays, remarks)){
      console.log(`Expiration found at row: ${iRow}`);
    }
  }
}

/*
 * 指定された内容でメール送信を行う。
 * 実行するアカウントのgmailを使用する。事前に許可済みであることが前提
 * @mailto: 送信先メールアドレス
 * @mailSubject: メール件名
 * @mailBody: メール本文
 */
function SendMail(mailTo, mailSubject, mailBody) {
  MailApp.sendEmail(mailTo, mailSubject, mailBody);
}