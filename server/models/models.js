const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

// User Table
const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'USER' },
    language: { type: DataTypes.STRING, defaultValue: 'en' },
    theme: {type: DataTypes.STRING, defaultValue: 'light'}
});

// Inventory table
const Inventory = sequelize.define('inventory', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    category: { type: DataTypes.STRING, allowNull: true },
    isPublic: { type: DataTypes.BOOLEAN, defaultValue: false },
    version: { type: DataTypes.INTEGER, defaultValue: 1 }, //?
    imageUrl: { type: DataTypes.STRING, allowNull: true }, //
    tags: { type: DataTypes.JSON, defaultValue: [] }, //
    customIdFormat: { type: DataTypes.STRING, defaultValue: 'item-{id}' } // Формат кастомных ID
});

// Table of custom fields for inventory
const InventoryField = sequelize.define('inventory_field', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    type: { type: DataTypes.STRING, allowNull: true },
    isShownInTable: { type: DataTypes.BOOLEAN, defaultValue: true }
});

// Inventory item table
const Item = sequelize.define('item', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    customId: { type: DataTypes.STRING, allowNull: false },
    // createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    // inventoryId: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     references: {
    //         model: Inventory,
    //         key: 'id'
    //     }
    // },
    // userId: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     references: {
    //         model: User,
    //         key: 'id'
    //     }
    // },
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
    boolean3: {type: DataTypes.BOOLEAN, allowNull: true},
});


// Table of discussion posts
const DiscussionPost = sequelize.define('discussion_post', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    likes: { type: DataTypes.JSON, defaultValue: {} },
    // createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
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

Inventory.hasMany(InventoryField, {onDelete: 'CASCADE'});
InventoryField.belongsTo(Inventory);

Inventory.hasMany(Item, {onDelete: 'CASCADE'});
Item.belongsTo(Inventory);

User.hasMany(Item, {onDelete: 'CASCADE'});
Item.belongsTo(User);

User.belongsToMany(Inventory, { through: InventoryAccess });
Inventory.belongsToMany(User, { through: InventoryAccess });

Inventory.hasMany(DiscussionPost, {onDelete: 'CASCADE'});
DiscussionPost.belongsTo(Inventory);

User.hasMany(DiscussionPost, {onDelete: 'CASCADE'});
DiscussionPost.belongsTo(User);

module.exports = {
    User,
    Inventory,
    InventoryField,
    Item,
    InventoryAccess,
    DiscussionPost
};