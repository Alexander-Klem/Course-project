const ApiError = require('../error/ApiError');
const { InventoryAccess, Inventory, User } = require('../models/models');

class inventoryAccessController { 
    async create(req, res, next) { 
        try {
            const { inventoryId, userId, accessLevel } = req.body;
            const inventory = await Inventory.findOne({ where: { id: inventoryId } });
            const user = await User.findOne({ where: { id: userId } });

            if (!inventory || !user) { 
                return next(ApiError.badRequest('Инвентарь или пользователь не найдены'))
            }

            if (inventory.userId !== req.user.id && req.user.role !== 'ADMIN') { 
                return next(ApiError.forbidden('Нет прав'))
            }

            const validAccessLevels = ['READ', 'WRITE'];

            if (accessLevel && !validAccessLevels.includes(accessLevel)) { 
                return next(ApiError.badRequest('Недопустимый уровень'))
            }

            const existingAccess = await InventoryAccess.findOne({ where: { inventoryId, userId } });

            if (existingAccess) { 
                return next(ApiError.badRequest('Пользователь уже имеет доступ к этому инвентарю'))
            }

            const newAccess = await InventoryAccess.create({
                inventoryId,
                userId,
                accessLevel: accessLevel || 'READ'
            });

            return res.json(newAccess);
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    async getAll(req, res, next) { 
        try {
            const { inventoryId } = req.params;
            const access = await InventoryAccess.findAll({ where: { inventoryId } });
            return res.json(access);
        } catch (error) {
            return next(ApiError.internal( error.message ));
        }
    }

    async delete(req, res, next) { 
        try {
            const { inventoryId, userId } = req.params;
            const access = await InventoryAccess.findOne({ where: { inventoryId, userId } });

            if (!access) { 
                return next(ApiError.badRequest('Доступ не найден'))
            }

            const inventory = await Inventory.findOne({ where: inventoryId });

            if (inventory.userId !== req.user.id && req.user.role !== 'ADMIN') { 
                return next(ApiError.forbidden('Нет прав'));
            }

            await access.destroy();
            return res.json({mwssage: 'Доступ удален'})
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении доступа'))
        }
    }
}

module.exports = new inventoryAccessController();