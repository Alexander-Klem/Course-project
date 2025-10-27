const ApiError = require('../error/ApiError');
const { InventoryField, Inventory } = require('../models/models');

class inventoryFieldController { 
    async create(req, res, next){ 
        try {
            const { inventoryId } = req.params;
            const { title, description, type, isShownInTable } = req.body;

            if (!title) { 
                return next(ApiError.badRequest('Название поля обязательно'));
            }

            const inventory = await Inventory.findOne({ where: { id: inventoryId } });
            if (!inventory) { 
                return next(ApiError.badRequest('Инвентарь не найден'))
            }
            if (inventory.userId !== req.user.id && req.user.role !== 'ADMIN') { 
                return next(ApiError.forbidden('У вас нет прав для создания полей'))
            }

            const existingField = await InventoryField.findOne({ where: { inventoryId, title } });
            if (existingField) {
                return next(ApiError.badRequest('Поле с таким названием уже существует в инвентаре'));
            }

            const field = await InventoryField.create({
                title,
                description,
                type,
                isShownInTable,
                inventoryId
            })

            return res.json(field);
        } catch (error) {
            return next(ApiError.badRequest(`Ошибка при создании полей`));
        }
    }

    async getAll(req, res, next) { 
        try {
            const { inventoryId } = req.params;
            const fields = await InventoryField.findAll({
                where: { inventoryId },
                // attributes: [
                //     'id',
                //     'title',
                //     'description',
                //     'type',
                //     'isShownInTable' 
                // ]
            })
            return res.json(fields);
        } catch (error) {
            return next(ApiError.badRequest(`Ошибка при получении полей`));
        }
    }

    async update(req, res, next) { 
        try {
            const { id } = req.params;
            const { title, description, type, isShownInTable } = req.body;

            const field = await InventoryField.findOne({ where: { id } });

            if (!field) {
                return next(ApiError.badRequest('Поле не найдено'));
            }

            const inventory = await Inventory.findOne({ where: { id: field.inventoryId } });

            if (inventory.userId !== req.user.id && req.user.role !== 'ADMIN') { 
                return next(ApiError.forbidden('У вас нет прав для редактирования полей'))
            }

            await field.update({
                title,
                description,
                type,
                isShownInTable
            });

            return res.json(field);
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении полей'))
        }
    }

    async delete(req, res, next) { 
        try {
            const { id } = req.params;
            const field = await InventoryField.findOne({ where: { id } });

            if (!field) { 
                return next(ApiError.badRequest('Поле не найден'));
            }

            const inventory = await Inventory.findOne({ where: { id: field.inventoryId } });
            if (inventory.userId !== req.user.id && req.user.role !== 'ADMIN') {
                return next(ApiError.forbidden('Нет прав'));
            }

            await field.destroy();
            return res.json({ message: 'Поле удалено' });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении поля'));
        }
    }
}

module.exports = new inventoryFieldController();