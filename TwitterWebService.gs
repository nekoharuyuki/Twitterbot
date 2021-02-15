// 認証用インスタンス
var twitter = TwitterWebService.getInstance(
  'ここにTwitterのConsumerKeyを入れる',       // 作成したアプリケーションのConsumer Key
  'ここにTwitterのConsumerSecretKeyを入れる'  // 作成したアプリケーションのConsumer Secret
);

// 認証
function authorize() {
  twitter.authorize();
}

// 認証解除
function reset() {
  twitter.reset();
}

// 認証後のコールバック
function authCallback(request) {
  return twitter.authCallback(request);
}

// セルを取得
var sheetData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("シート1"); // 「シート1」はシート名
var postMessageCell = sheetData.getRange(2, 2); // セルの位置。縦横それぞれ1～の番号で指定できる

// ツイートを投稿
function postUpdateStatus() {
  var message = pickUpTweet();
  if (message == "") {
    return;
  }
  var service  = twitter.getService();
  var response = service.fetch('https://api.twitter.com/1.1/statuses/update.json', {
    method: 'post',
    payload: { status: message }
  });
}

// ツイートを選択
function pickUpTweet() {
  var cells = sheetData.getRange(2, 1, sheetData.getLastRow() - 1, 2).getValues();
  var weightSum = 0;
  for (var i = 0, il = cells.length; i < il; i++ ) {
    weightSum += cells[i][1];
  }
  if (weightSum == 0) {
    return "";
  }
  var randomValue = weightSum * Math.random();

  var postMessage = "";
  for (var i = 0, il = cells.length; i < il; i++ ) {
    randomValue -= cells[i][1];
    if (randomValue < 0) {
      postMessage = cells[i][0];
      break;
    }
  }
  return postMessage;
}
