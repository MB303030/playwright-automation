export const negativeLoginTestCases = [
    {
        name: 'Wrong username',
        username: 'wronguser',
        password: 'SuperSecretPassword!',
        expectedError: 'Your username is invalid!'
    },
    {
        name: 'Empty username',
        username: '',
        password: 'SuperSecretPassword!',
        expectedError: 'Your username is invalid!'
    },
    {
        name: 'Special characters username',
        username: '!@#$%^&*()_+',
        password: 'SuperSecretPassword!',
        expectedError: 'Your username is invalid!'
    },
    {
        name: 'SQL injection username',
        username: "' OR '1'='1",
        password: 'SuperSecretPassword!',
        expectedError: 'Your username is invalid!'
    },
    {
        name: 'Invalid password',
        username: 'tomsmith',
        password: 'wrongpassword',
        expectedError: 'Your password is invalid!'
    },
    {
        name: 'Long invalid password',
        username: 'tomsmith',
        password: '!@#$%^&*()POUYTREWQfggghggfbfbdfbdfgdfgdfgdsfsafasfasdasd?><',
        expectedError: 'Your password is invalid!'
    },
    {
        name: 'Empty password',
        username: 'tomsmith',
        password: '',
        expectedError: 'Your password is invalid!'
    },
    {
        name: 'Both fields empty',
        username: '',
        password: '',
        expectedError: 'Your username is invalid!'
    }
];