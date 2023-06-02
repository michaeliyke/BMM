(async () => {
  function delay(time) {
    return new Promise(r => setTimeout(r, time))
  }

  await delay(10000)
  try {
    let card = document.querySelectorAll("[aria-label='Timeline: Pius da dev’s Tweets'] .css-1dbjc4n.r-j5o65s.r-qklmqi.r-1adg3ll.r-1ny4l3l");
    await delay(1000)
    for (let i = 0; i < card.length; i++) {
      const del_menu = card[i].querySelector("[data-testid='caret']")
      const retwt = card[i].querySelector("[aria-label='Timeline: Pius da dev’s Tweets']>div>[data-testid] [data-testid='unretweet']");
      await delay(1000)
      if (retwt != null) {
        retwt.click();
        await delay(1000)
        const confirmu = document.querySelector("[data-testid='unretweetConfirm']");
        await delay(1000)
        confirmu.click();
        await delay(1000)

      }
      else {
        del_menu.click();
        await delay(1000)
        const delet = document.querySelector("[data-testid='Dropdown']>div");
        await delay(1000)
        delet.click()
        await delay(1000)
        const confirmdel = document.querySelector("[data-testid='confirmationSheetConfirm']");
        await delay(1000)
        confirmdel.click();
        await delay(1000)

      }
    }
  } catch (e) {
    console.log(e)
  }


  window.location.reload();




})()

