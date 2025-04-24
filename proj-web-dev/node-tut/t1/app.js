const names = require('./names')
const sayHi = require('./utils')
const genericData = require('./alt-flavor')

require('./mind-gren')

for (const name in names) {
    sayHi(name);
}
