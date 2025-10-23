const hbs = require('hbs');

export function configureHandlebars() {
  // Helper for formatting dates
  hbs.registerHelper('formatDate', function (date: Date | string) {
    if (!date) return 'N/A';

    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  });

  // Helper for formatting date only
  hbs.registerHelper('formatDateOnly', function (date: Date | string) {
    if (!date) return 'N/A';

    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  });

  // Helper for formatting time only
  hbs.registerHelper('formatTimeOnly', function (date: Date | string) {
    if (!date) return 'N/A';

    const d = new Date(date);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  });

  // Helper for equality comparison
  hbs.registerHelper('eq', function (a: any, b: any) {
    return a === b;
  });

  // Helper for substring
  hbs.registerHelper(
    'substring',
    function (str: string, start: number, end?: number) {
      if (!str) return '';
      if (end) {
        return str.substring(start, end);
      }
      return str.substring(start);
    },
  );

  // Helper for first character (for avatars)
  hbs.registerHelper('firstChar', function (str: string) {
    if (!str) return '?';
    return str.charAt(0).toUpperCase();
  });

  // Helper for number formatting
  hbs.registerHelper('formatNumber', function (num: number) {
    if (typeof num !== 'number') return '0';
    return num.toLocaleString();
  });

  // Helper for conditionals
  hbs.registerHelper('if_eq', function (a: any, b: any, opts: any) {
    if (a === b) {
      return opts.fn(this);
    } else {
      return opts.inverse(this);
    }
  });

  // Helper for JSON stringification
  hbs.registerHelper('json', function (context: any) {
    return JSON.stringify(context);
  });

  // Helper for checking if array has items
  hbs.registerHelper('hasItems', function (array: any[]) {
    return array && array.length > 0;
  });

  // Helper for pagination range
  hbs.registerHelper('range', function (start: number, end: number) {
    const range: number[] = [];
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  });

  // Helper for checking if user is recently active (within 30 days)
  hbs.registerHelper('isRecentlyActive', function (updated_at: Date | string) {
    if (!updated_at) return false;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const userLastUpdate = new Date(updated_at);
    return userLastUpdate >= thirtyDaysAgo;
  });

  // Helper for counting items with specific status
  hbs.registerHelper('countStatus', function (items: any[], status: string) {
    if (!items || !Array.isArray(items)) return 0;
    return items.filter((item) => item.status === status).length;
  });
}
