import {expect} from '@playwright/test'
import CommonActions from '../utils/CommonActions.js'

import { url } from 'node:inspector'

export default class LoginPage{

    constructor(page){
        this.actions = new CommonActions(page)
        this.usernameSelector = '#username'
    }

    async navigate(){
        await this.actions.navigate('https://the-internet.herokuapp.com/login')
    }

    async login(username, password){
        await this.actions.fill(this.usernameSelector,username)
        await this.actions.fill('#password',password)
        await this.actions.click('button[type=submit]')

    }
}