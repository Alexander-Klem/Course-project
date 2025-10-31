const ApiError = require('../error/ApiError');
const { Item, Inventory } = require('../models/models');
const uuid = require('uuid');

class ItemController { 
    async create(req, res, next) { 
        try {
            const { inventoryId } = req.params;
            const inventory = await Inventory.findOne({ where: { id: inventoryId } });

            if (!inventory) { 
                return next(ApiError.badRequest('Инвентарь не найден'));
            }

            if (inventory.userId !== req.user.id && req.user.role !== 'ADMIN') {
                return next(ApiError.forbidden('Нет прав'));
            }

            let format = inventory.customIdFormat;
            const nextId = await Item.count({ where: { inventoryId: inventoryId } }) + 1;
            let customId;


            if (!format || typeof format !== 'string') { 
                format = 'item-{id}'
            }

            if (format.includes('{id}')) {
                customId = format.replace('{id}', nextId)
            } else if (format.includes('{random}')) {
                const random = Math.floor(Math.random() * 100000)
                customId = format.replace('{random}', random);
            } else if (format.includes('{guid}')) {
                customId = format.replace('{guid}', uuid.v4());
            } else if (format.includes('{date}')) {
                const date = new Date().toISOString().split('T')[0];
                customId = format.replace('{date}', date);
            } else { 
                customId = format;
            }

            // customId = customIdFormat.replace('{id}', nextId);

            const existingItem = await Item.findOne({
                where: { inventoryId: inventoryId, customId }
            });

            if (existingItem) { 
                return next(ApiError.badRequest('customId уже существует в инвентаре'))
            }

            const item = await Item.create({
                customId,
                inventoryId: inventoryId,
                userId: req.user.id,
                createdBy: req.user.id,
                ...req.body
            });

            return res.json(item);
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    async getAll(req, res, next) { 
        try {
            const { inventoryId } = req.params;
            const items = await Item.findAll({ where: { inventoryId: inventoryId } });
            return res.json(items);
        } catch (error) { 
            return next(ApiError.internal('Ошибка при получении элементов'))
        }
    }

    async getOne(req, res, next) { 
        try {
            const { id } = req.params;
            const item = await Item.findOne({ where: { id: id } });

            if (!item) { 
                return next(ApiError.badRequest('Элемент не найден'));
            }

            return res.json(item);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении элемента'));
        }
    }

    async update() { 
        try {
            const { id } = req.params;
            const item = await Item.findOne({ where: { id: id } });

            if (!item){ 
                return next(ApiError.badRequest('Элемент не найден'))
            }

            if (req.body.customId && req.body.customId !== item.customId) { 
                const existingItem = await Item.findOne({
                    where: {
                        inventoryId: item.inventoryId,
                        customId: req.body.customId
                    }
                })

                if(existingItem) { 
                    return next(ApiError.badRequest('customId уже существует в инвентаре'))            
                }
            }

            await item.update(req.body);
            return res.json(item);
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении элемента'))
        }
    }

    async delete(req, res, next) { 
        try {
            const { id } = req.params;
            const item = await Item.findOne({ where: { id: id } });
        
            if (!item) {
                return next(ApiError.badRequest('Элемент не найден'));
            }

            const inventory = await Inventory.findOne({ where: { id: item.inventoryId } });

            if (inventory.userId !== req.user.id && req.user.role !== 'ADMIN') {
                return next(ApiError.forbidden('Нет прав'));
            }

            await item.destroy();
            return res.json({
                message: 'Элемент удален'
            });
        } catch (error) { 
            return next(ApiError.internal('Ошибка при удалении элемента'))
        }
    }
}

module.exports = new ItemController();