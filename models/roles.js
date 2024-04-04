const roles = require('../config/roles.json');

class Role {
    constructor() { 
        this.roles = roles.roles;
    }

    getRoleByName(name){ 
        return this.roles.map((role) => role.name === name);
    }

    getRoles() {
        return this.roles;
    }
}

module.exports = Role;