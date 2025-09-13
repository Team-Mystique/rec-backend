#!/usr/bin/env node

/**
 * Code Quality and Bug Detection Script
 * Checks for common issues in the rec-backend codebase
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Running code quality checks...\n');

let issues = 0;
let warnings = 0;

// Helper function to check file content
function checkFile(filePath, checks) {
    if (!fs.existsSync(filePath)) {
        console.log(`❌ File missing: ${filePath}`);
        issues++;
        return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    checks.forEach(check => {
        const result = check.test(content);
        if (result) {
            if (check.severity === 'error') {
                console.log(`❌ ${check.message} in ${filePath}`);
                issues++;
            } else {
                console.log(`⚠️  ${check.message} in ${filePath}`);
                warnings++;
            }
        }
    });
}

// Check package.json
checkFile('../package.json', [
    {
        test: (content) => {
            const pkg = JSON.parse(content);
            return pkg.main !== 'server.js';
        },
        message: 'Main entry point should be server.js',
        severity: 'error'
    },
    {
        test: (content) => {
            const pkg = JSON.parse(content);
            return !pkg.scripts.start.includes('server.js');
        },
        message: 'Start script should reference server.js',
        severity: 'error'
    }
]);

// Check for missing semicolons
checkFile('../routes/index.js', [
    {
        test: (content) => /router\.post\([^;]*$(?!\n\s*})/m.test(content),
        message: 'Missing semicolon in router.post statement',
        severity: 'error'
    }
]);

// Check auth middleware
checkFile('../middlewares/auth.js', [
    {
        test: (content) => content.trim().length === 0,
        message: 'Authentication middleware is empty',
        severity: 'error'
    },
    {
        test: (content) => !content.includes('verifyToken'),
        message: 'Missing verifyToken function in auth middleware',
        severity: 'error'
    }
]);

// Check for environment variable handling
checkFile('../config/db.js', [
    {
        test: (content) => !content.includes('process.env.MONGODB_URI') && !content.includes('process.env.MONGO_URI'),
        message: 'Missing environment variable for MongoDB connection',
        severity: 'error'
    }
]);

// Check user controller
checkFile('../controllers/userController.js', [
    {
        test: (content) => !content.includes('JWT_SECRET'),
        message: 'JWT_SECRET validation missing',
        severity: 'warning'
    },
    {
        test: (content) => !content.includes('validRoles'),
        message: 'Role validation missing',
        severity: 'warning'
    }
]);

// Check for empty route files
['../routes/dashboard.js', '../routes/admin.js'].forEach(file => {
    checkFile(file, [
        {
            test: (content) => content.trim().length === 0,
            message: 'Route file is empty',
            severity: 'error'
        }
    ]);
});

// Check for unwanted files
const unwantedFiles = ['../v', '../controllers/generate-token.js'];
unwantedFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`❌ Unwanted file exists: ${file}`);
        issues++;
    }
});

// Check .env.example exists
if (!fs.existsSync('../.env.example')) {
    console.log('⚠️  .env.example file missing - users might not know how to configure environment');
    warnings++;
}

// Summary
console.log('\n📊 Code Quality Report:');
console.log(`🐛 Issues found: ${issues}`);
console.log(`⚠️  Warnings: ${warnings}`);

if (issues === 0 && warnings === 0) {
    console.log('🎉 All checks passed! Code quality is excellent.');
} else if (issues === 0) {
    console.log('✅ No critical issues found. Some warnings to consider.');
} else {
    console.log('❌ Critical issues found that need to be addressed.');
    process.exit(1);
}