"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureHandlebars = configureHandlebars;
const hbs = require('hbs');
function configureHandlebars() {
    hbs.registerHelper('formatDate', function (date) {
        if (!date)
            return 'N/A';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    });
    hbs.registerHelper('formatDateOnly', function (date) {
        if (!date)
            return 'N/A';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    });
    hbs.registerHelper('formatTimeOnly', function (date) {
        if (!date)
            return 'N/A';
        const d = new Date(date);
        return d.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    });
    hbs.registerHelper('eq', function (a, b) {
        return a === b;
    });
    hbs.registerHelper('substring', function (str, start, end) {
        if (!str)
            return '';
        if (end) {
            return str.substring(start, end);
        }
        return str.substring(start);
    });
    hbs.registerHelper('firstChar', function (str) {
        if (!str)
            return '?';
        return str.charAt(0).toUpperCase();
    });
    hbs.registerHelper('formatNumber', function (num) {
        if (typeof num !== 'number')
            return '0';
        return num.toLocaleString();
    });
    hbs.registerHelper('if_eq', function (a, b, opts) {
        if (a === b) {
            return opts.fn(this);
        }
        else {
            return opts.inverse(this);
        }
    });
    hbs.registerHelper('json', function (context) {
        return JSON.stringify(context);
    });
    hbs.registerHelper('hasItems', function (array) {
        return array && array.length > 0;
    });
    hbs.registerHelper('range', function (start, end) {
        const range = [];
        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        return range;
    });
    hbs.registerHelper('isRecentlyActive', function (updated_at) {
        if (!updated_at)
            return false;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const userLastUpdate = new Date(updated_at);
        return userLastUpdate >= thirtyDaysAgo;
    });
    hbs.registerHelper('countStatus', function (items, status) {
        if (!items || !Array.isArray(items))
            return 0;
        return items.filter((item) => item.status === status).length;
    });
}
//# sourceMappingURL=handlebars.config.js.map