// constants/test_data.js
export const TEST_DATA = {
    CREDENTIALS: {
        VALID: {
            USERNAME: 'tomsmith',
            PASSWORD: 'SuperSecretPassword!'
        }
    },
    SELECTORS: {
        // Login page selectors
        LOGIN_FORM: {
            USERNAME: '#username',
            PASSWORD: '#password',
            SUBMIT_BUTTON: 'button[type="submit"]',
            FORM: '#login',
            REMEMBER_ME: 'input[name="remember"]'
        },
        // Secure area selectors
        SECURE_AREA: {
            LOGOUT_BUTTON: 'a.button.secondary',
            FLASH_MESSAGE: '#flash',
            HEADER: 'h2'
        }
    },
    LABELS: {
        USERNAME: 'Username',
        PASSWORD: 'Password',
        LOGOUT_BUTTON: 'Logout'
    },
    PAGE: {
        TITLE: 'The Internet',
        HEADER: 'Login Page'
    },
    MESSAGES: {
        // Login success/error messages
        LOGIN_SUCCESS: 'You logged into a secure area!',
        USERNAME_INVALID: 'Your username is invalid!',
        PASSWORD_INVALID: 'Your password is invalid!',
        
        // Secure area messages
        SECURE_AREA_TITLE: 'Secure Area', 
        WELCOME_MESSAGE: 'Welcome to the Secure Area. When you are done click logout below.'
    }
};