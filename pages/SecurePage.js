import { expect } from "@playwright/test";
import CommonActions from "../utils/CommonActions.js";

export default class SecurePage {

    constructor(page){
            this.page = page;
            this.action = new CommonActions(page)
        }

    async getMessage(){
        return await this.action.getText('#flash')
    }

    async getInvalideUserErrorMessage(){
        return await this.action.getText('#flash')
    }

    async getInvalidePasswordErrorMessage(){
        return await this.action.getText('#flash')
    }

   async getUsernameLabelText() {
        return await this.action.getTextByText('Username', { exact: true });
    }

    async assertLoggedInMessage(passmessage){

        const message = await this.getMessage()
        expect (message).toContain(passmessage)
    }
}

     
