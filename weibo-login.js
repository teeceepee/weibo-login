// Usage: phantomjs weibo-login.js [username] [password]
// API: http://phantomjs.org/api/
var system = require("system")

// Arguments
var username = system.args[1]
var password = system.args[2]

if (!username || !password) {
  console.log("Usage: phantomjs " + system.args[0] + " [username] [password]")
  phantom.exit()
}

// Constants
var LOGIN_URL = "http://weibo.com/login.php"
var HOME_URL_PATTERN = new RegExp("http://weibo.com/.*/home")

// Utils
var getCookies = function (page) {
  var cookieString = page.cookies.map(function (cookie) {
    return cookie.name + "=" + cookie.value
  }).join("; ")

  return "Cookie: " + cookieString
}

// Login simulation
var page = require("webpage").create()

page.onResourceReceived = function(response) {

  if (response.url === page.url && response.stage === "end") {
    console.debug("Loaded  url: " + page.url)

    // 如果跳转到用户主页则表示登录成功
    if (HOME_URL_PATTERN.test(page.url)) {
      var cookies = getCookies(page)
      console.log("")
      console.log(cookies)
      console.log("")

      phantom.exit()
    }
  }
}

page.onUrlChanged = function (targetUrl) {
  if (targetUrl !== "about:blank") {
    console.debug("Loading url: " + targetUrl)

  }
}

page.open(LOGIN_URL, function (status) {
  if (status !== "success") {
    console.debug("Failed to load url " + LOGIN_URL)
    phantom.exit()
  }

  // 填写用户名密码并点击提交按钮
  page.evaluate(function (username, password) {
    var usernameInput = document.querySelector("[name=username]")
    var passwordInput = document.querySelector("[name=password]")
    var submitBtn = document.querySelector('[node-type="submitBtn"]')

    usernameInput.value = username
    passwordInput.value = password
    submitBtn.click()
  }, username, password)

  setTimeout(function () {
    console.debug("Login Failed")
    phantom.exit()
  }, 10000)
})
