const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

// User Table
const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING },
    language: { type: DataTypes.STRING },
    theme: {type: DataTypes.STRING}
});

// Inventory table
const Inventory = sequelize.define('inventory', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    category: { type: DataTypes.STRING },
    isPublic: { type: DataTypes.BOOLEAN },
    version: { type: DataTypes.INTEGER }, 
    imageUrl: { type: DataTypes.STRING }, 
    tags: { type: DataTypes.JSON, defaultValue: [] }, 
    customIdFormat: { type: DataTypes.STRING, defaultValue: 'item-{id}' }
});


// Inventory item table
const Item = sequelize.define('item', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    customId: { type: DataTypes.STRING, allowNull: false },
    inventoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Inventory,
            key: 'id'
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    singleLine1: {type: DataTypes.STRING, allowNull: true},
    singleLine2: {type: DataTypes.STRING, allowNull: true},
    singleLine3: {type: DataTypes.STRING, allowNull: true },
    multiLine1: {type: DataTypes.TEXT, allowNull: true},
    multiLine2: {type: DataTypes.TEXT, allowNull: true},
    multiLine3: {type: DataTypes.TEXT, allowNull: true },
    numeric1:   {type: DataTypes.INTEGER, allowNull: true},
    numeric2:   {type: DataTypes.INTEGER, allowNull: true},
    numeric3:   {type: DataTypes.INTEGER, allowNull: true },
    imageLink1: {type: DataTypes.STRING, allowNull: true},
    imageLink2: {type: DataTypes.STRING, allowNull: true},
    imageLink3: {type: DataTypes.STRING, allowNull: true },
    boolean1: {type: DataTypes.BOOLEAN, allowNull: true},
    boolean2: {type: DataTypes.BOOLEAN, allowNull: true},
    boolean3: { type: DataTypes.BOOLEAN, allowNull: true },
});

// Access table
const InventoryAccess = sequelize.define('inventory_access', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    accessLevel: {
        type: DataTypes.STRING,
        defaultValue: 'READ',
        validate: { isIn: [['READ', 'WRITE']] }
    }
});


User.hasMany(Inventory, {onDelete: 'CASCADE'});
Inventory.belongsTo(User);

Inventory.hasMany(Item, {onDelete: 'CASCADE'});
Item.belongsTo(Inventory);

User.hasMany(Item, {onDelete: 'CASCADE'});
Item.belongsTo(User);

User.belongsToMany(Inventory, { through: InventoryAccess });
Inventory.belongsToMany(User, { through: InventoryAccess });


module.exports = {
    User,
    Inventory,
    Item,
    InventoryAccess,
};