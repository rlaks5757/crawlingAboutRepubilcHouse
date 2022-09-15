const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const sendMail = require("../node_mailer/sendMail");

const getRepublicHouseData = async () => {
  try {
    // 1.브라우저 열기
    const driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(
        new chrome.Options()
          .headless()
          .addArguments("--disable-gpu", "window-size=1920x1080", "lang=ko_KR")
      )
      .build();

    // 2. 특정 URL 생성
    await driver.get("https://soco.seoul.go.kr/youth/main/main.do");

    // 3. 공지사항 가져오기
    let getNoticeList = await driver
      .findElement(By.className("mainBoard_list on"))
      .findElements(By.css("li"));

    let noticeList_arr = [];

    for (let i = 0; i < getNoticeList.length - 1; i++) {
      const title = await getNoticeList[i].findElement(By.css("a")).getText();
      const link = await getNoticeList[i]
        .findElement(By.css("a"))
        .getAttribute("href");
      const date = await getNoticeList[i].findElement(By.css("span")).getText();
      noticeList_arr.push({ title, link, date });
    }

    // 4. Node_Mailer 동작시키기
    sendMail(noticeList_arr);

    // 5. 3초 후에 브라우저 종료
    setTimeout(async () => {
      await driver.quit();
      process.exit(0);
    }, 3000);
  } catch (err) {
    console.log(err);
  }
};

// getRepublicHouseData();

module.exports = getRepublicHouseData;
