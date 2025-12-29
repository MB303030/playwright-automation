import LoginPage from "./Loging.js";
import SecurePage from "./SecurePage.js";

export default class PomManager{
    constructor(page){
        this.page = page;
        this.loginPage = new LoginPage(page)
        this.securePage = new SecurePage(page)
    }
}