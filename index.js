; (function (w, d) {
    async function retwt_del() {
        await delay(10000);
        try {
            let card = qs("[aria-label='Timeline: Pius da dev’s Tweets'] .css-1dbjc4n.r-j5o65s.r-qklmqi.r-1adg3ll.r-1ny4l3l");
            await delay(1000);
            for (let i = 0; i < card.length; i++) {
                const del_menu = qs(card[i], "[data-testid='caret']");
                const retwt = qs(card[i],
                    "[aria-label='Timeline: Pius da dev’s Tweets']>div>[data-testid] [data-testid='unretweet']");
                await delay(1000);
                if (retwt != null) {
                    retwt.click();
                    await delay(1000)
                    const confirmu = qs("[data-testid='unretweetConfirm']");
                    await delay(1000)
                    confirmu.click();
                    await delay(1000)

                }
                else {
                    del_menu.click();
                    await delay(1000)
                    const delet = qs("[data-testid='Dropdown']>div");
                    await delay(1000)
                    delet.click()
                    await delay(1000)
                    const confirmdel = qs("[data-testid='confirmationSheetConfirm']");
                    await delay(1000)
                    confirmdel.click();
                    await delay(1000)

                }
            }
        } catch (e) {
            console.log(e);
        }

        w.location.reload();
    }

    /**
     * Short for of querySelector
     * If only one argument is provided, e is the selector string
     * @param {HTMLElement} e An element node
     * @param {String} str The selector string
     * @returns The match or NULL
     */
    function qs(e, str) {
        const d = document, select = d.querySelector.bind(d);
        return (e instanceof Node ? select.call(e, str) : select(e));
    }

    /**
     * Delay for certain amount of milliseconds
     * @param {number} time Time in milliseconds
     * @returns A Promise object
     */
    function delay(time) {
        return new Promise(r => setTimeout(r, time));
    }
}(window, document));
