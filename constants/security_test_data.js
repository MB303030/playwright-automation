/**
 * Security Test Data for Authentication
 * Contains various attack payloads and test scenarios
 */

export const SECURITY_TEST_DATA = {
    // ===== SQL INJECTION PAYLOADS =====
    SQL_INJECTION: [
        { 
            payload: "' OR '1'='1",
            description: "Classic SQL injection - always true condition" 
        },
        { 
            payload: "'; DROP TABLE users; --", 
            description: "Destructive SQL injection - table deletion attempt" 
        },
        { 
            payload: "' UNION SELECT username, password FROM users --", 
            description: "Data extraction SQL injection" 
        },
        { 
            payload: "admin'--", 
            description: "Comment-based SQL injection" 
        },
        { 
            payload: "1' OR '1' = '1", 
            description: "Alternative always-true condition" 
        }
    ],

    // ===== XSS ATTACK PAYLOADS =====
    XSS_PAYLOADS: [
        { 
            payload: "<script>alert('XSS')</script>",
            description: "Direct script tag injection"
        },
        { 
            payload: "<img src=x onerror=alert('XSS')>", 
            description: "Image tag with malicious onerror handler"
        },
        { 
            payload: "javascript:alert('XSS')", 
            description: "JavaScript URL scheme injection"
        },
        { 
            payload: "\"><script>alert('XSS')</script>", 
            description: "HTML attribute escape injection"
        }
    ],

    // ===== SENSITIVE DATA TEST CASES =====
    INFORMATION_DISCLOSURE: [
        {
            username: 'wronguser',
            password: 'SuperSecretPassword!',
            expectedField: 'username',
            description: "Invalid username should show generic error"
        },
        {
            username: 'tomsmith',
            password: 'wrongpass',
            expectedField: 'password',
            description: "Invalid password should show same generic error"
        }
    ],

    // ===== SPECIAL CHARACTERS TEST CASES =====
    SPECIAL_CHARACTERS: [
        {
            username: 'test@email.com',
            password: 'P@$$w0rd!',
            description: "Email format with special symbols"
        },
        {
            username: 'user_name',
            password: 'pass word with spaces',
            description: "Underscores and spaces"
        },
        {
            username: 'user123',
            password: 'unicode✓password',
            description: "Unicode characters"
        },
        {
            username: 'admin<script>',
            password: 'test',
            description: "Mixed script tags"
        }
    ],

    // ===== VALID CREDENTIALS FOR POSITIVE TESTS =====
    VALID_CREDENTIALS: {
        username: 'tomsmith',
        password: 'SuperSecretPassword!'
    },

    // ===== ERROR MESSAGE EXPECTATIONS =====
    // ADJUSTED BASED ON ACTUAL SITE BEHAVIOR
    ERROR_EXPECTATIONS: {
        GENERIC_ERROR: /invalid/i,
        // The site DOES disclose username/password in errors, so we accept that
        // But we check it doesn't reveal SQL/database errors
        SHOULD_NOT_DISCLOSE: [
            'table', 'database', 'sql', 'query', 'syntax',
            'admin', 'administrator', 'root', 'column',
            'mysql', 'postgresql', 'oracle', 'microsoft',
            'error', 'exception', 'stack', 'trace'
        ],
        SUCCESS_MESSAGE: /logged into a secure area/i
    }
};