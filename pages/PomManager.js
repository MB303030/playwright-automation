import LoginPage from "./Loging.js";
import SecurePage from "./SecurePage.js";

export default class PomManager{
    constructor(page){
         // Store the Playwright page reference for dependency injection
        this.page = page;

        // Initialize LoginPage instance for login-related actions
        this.loginPage = new LoginPage(page)
        
        // Initialize SecurePage instance for post-login/dashboard actions
        this.securePage = new SecurePage(page)
    }
}