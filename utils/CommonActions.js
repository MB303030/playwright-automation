export default class CommonActions{
    constructor(page){
        this.page = page;
    }

    async navigate(url){
        //await this.page.pause()
        await this.page.goto(url)
    }

    async click(selector){
        await this.page.click(selector)
    }

    async fill(selector, text){
        await this.page.fill(selector, text)

    }

    async getText(selector){
        return await this.page.textContent(selector)
    }

     async getTextByText(text, options = {}) {
        return await this.page.getByText(text, options).textContent();
    }

     async verifyPageTitle(expectedTitle) {
        return await expect(this.page).toHaveTitle(expectedTitle);
    }

    async isChecked(selector){
        return await this.page.isChecked(selector)
    }
    
}