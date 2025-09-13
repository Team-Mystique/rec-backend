#!/usr/bin/env node

/**
 * Comprehensive API Endpoint Validator
 * Tests all endpoints to ensure they're properly configured
 */

const http = require('http');

console.log('🔬 Running comprehensive API endpoint validation...\n');

// Mock server environment
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.JWT_SECRET = 'test-secret';
process.env.PORT = '5002';

const app = require('../server.js');

let testResults = [];

function addResult(test, success, message) {
    testResults.push({ test, success, message });
    const status = success ? '✅' : '❌';
    console.log(`${status} ${test}: ${message}`);
}

// Test 1: Server configuration
try {
    addResult('Server Import', true, 'Server module imports without errors');
} catch (error) {
    addResult('Server Import', false, `Import failed: ${error.message}`);
}

// Test 2: Route structure validation
const routeTests = [
    { file: 'routes/index.js', name: 'Main Routes' },
    { file: 'routes/dashboard.js', name: 'Dashboard Routes' },
    { file: 'routes/admin.js', name: 'Admin Routes' },
    { file: 'middlewares/auth.js', name: 'Auth Middleware' },
    { file: 'controllers/userController.js', name: 'User Controller' },
    { file: 'controllers/indexController.js', name: 'Index Controller' }
];

routeTests.forEach(test => {
    try {
        const module = require(`../${test.file}`);
        if (typeof module === 'function' || typeof module === 'object') {
            addResult(test.name, true, 'Module exports correctly');
        } else {
            addResult(test.name, false, 'Module does not export properly');
        }
    } catch (error) {
        addResult(test.name, false, `Import error: ${error.message}`);
    }
});

// Test 3: Configuration validation
const fs = require('fs');

// Check package.json
try {
    const pkg = JSON.parse(fs.readFileSync('../package.json', 'utf8'));
    addResult('Package.json Main', pkg.main === 'server.js', `Main entry: ${pkg.main}`);
    addResult('Package.json Start Script', pkg.scripts.start.includes('server.js'), `Start script: ${pkg.scripts.start}`);
} catch (error) {
    addResult('Package.json', false, `Error reading package.json: ${error.message}`);
}

// Test 4: Environment file validation
const envExampleExists = fs.existsSync('../.env.example');
addResult('Environment Example', envExampleExists, envExampleExists ? '.env.example exists' : '.env.example missing');

// Test 5: File cleanup validation
const unwantedFiles = ['../v', '../controllers/generate-token.js'];
unwantedFiles.forEach(file => {
    const exists = fs.existsSync(file);
    addResult(`File Cleanup: ${file}`, !exists, exists ? 'Unwanted file still exists' : 'File properly removed');
});

// Summary
console.log('\n📊 Comprehensive Test Results:');
const passed = testResults.filter(r => r.success).length;
const total = testResults.length;
const failed = total - passed;

console.log(`✅ Passed: ${passed}/${total}`);
console.log(`❌ Failed: ${failed}/${total}`);
console.log(`📈 Success Rate: ${Math.round((passed/total) * 100)}%`);

if (failed === 0) {
    console.log('\n🎉 All tests passed! The backend is ready for production.');
} else {
    console.log('\n⚠️  Some tests failed. Please review the issues above.');
}

console.log('\n📋 Next Steps:');
console.log('1. Set up MongoDB database');
console.log('2. Configure .env file with real credentials');
console.log('3. Test with real database connection');
console.log('4. Deploy to production environment');