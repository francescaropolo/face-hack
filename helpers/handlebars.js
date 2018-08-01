const hbs = require('hbs');

// Global route for hbs partials
hbs.registerPartials(__dirname + '/../views/partials');

// Helper to compare strings on views using {{#ifEquals arg1 arg2}} {{/ifEquals}}
hbs.registerHelper('ifEquals', (arg1, arg2, options) => {
    return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
});

// Helper to do if with all the operators
hbs.registerHelper('ifCond', (v1, operator, v2, options) => {
    switch (operator) {
    case '==':
        return (v1 == v2) ? options.fn(this) : options.inverse(this);
    case '===':
        return (v1 === v2) ? options.fn(this) : options.inverse(this);
    case '!==':
        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
    case '<':
        return (v1 < v2) ? options.fn(this) : options.inverse(this);
    case '<=':
        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
    case '>':
        return (v1 > v2) ? options.fn(this) : options.inverse(this);
    case '>=':
        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
    case '&&':
        return (v1 && v2) ? options.fn(this) : options.inverse(this);
    case '||':
        return (v1 || v2) ? options.fn(this) : options.inverse(this);
    default:
        return options.inverse(this);
    }
});
