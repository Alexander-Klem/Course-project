const ApiError = require('../error/ApiError');
const { Inventory } = require('../models/models');

class InventoryController { 
    async create(req, res, next) {  
        try {
            const {
                title,
                description,
                category,
                isPublic,
                version,
                imageUrl,
                tags,
                customIdFormat } = req.body;
            
            const userId = req.user.id;

            if (!title) { 
                return next(ApiError.badRequest('Название инвентаря обязательно'));
            }

            const inventory = await Inventory.create({
                title,
                description,
                category,
                isPublic,
                version,
                imageUrl,
                tags,
                customIdFormat,
                userId,
                version: 1
            });

            return res.json(inventory);
        } catch (error) {
            return next(ApiError.badRequest(`Ошибка при создании инвентаря`))
        }
    }
    
    async getAll(req, res, next) { 
        try {
            const inventories = await Inventory.findAll({ 
                attributes: ['id', 'title', 'category', 'isPublic', 'createdAt']
            });
            return res.json(inventories);
        } catch (error) {
            return next(ApiError.badRequest('Ошибка при получении списка инвентарей'))
        }
        
    }

    async getOne(req, res, next) { 
        try {
            const { id } = req.params;
            const inventory = await Inventory.findOne({
                where: { id },
                attributes: [
                    'id',
                    'title',
                    'description',
                    'category',
                    'isPublic',
                    'version',
                    'imageUrl',
                    'tags',
                    'customIdFormat',
                    'createdAt',
                    'updatedAt'
                ]
            })

            if (!inventory) { 
                return next(ApiError.badRequest('Инвентарь не найден'));
            }

            return res.json(inventory);
        } catch (error) {
            return next(ApiError.badRequest('Ошибка при получении инвентаря'));
        }
    }

    async update(req, res, next) { 
        try {
            const { id } = req.params;
            const { title,
                description,
                category,
                isPublic,
                version,
                imageUrl,
                tags,
                customIdFormat } = req.body;
            
            const inventory = await Inventory.findOne({ where: { id } });

            if (!inventory) { 
                return next(ApiError.badRequest('Инвентарь не найден'))
            }

            if (inventory.userId !== req.user.id && req.user.role !== 'ADMIN') { 
                return next(ApiError.forbidden('У вас нет прав для редактирования'));
            }

            if (version !== undefined && version !== inventory.version) { 
                return next(ApiError.forbidden('Инвентарь был изменен другим пользователем'))
            }

            const versionInventory = inventory.version + 1;

            await inventory.update({
                title,
                description,
                category,
                isPublic,
                versionInventory,
                imageUrl,
                tags,
                customIdFormat
            });

            return res.json(inventory);

        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении инвентаря'));
        }
    }

    async delete(req, res, next) { 
        try {
            const { id } = req.params;
            console.log(id);
            const inventory = await Inventory.findOne({ where: { id } });

            if (!inventory) { 
                return next(ApiError.badRequest('Инвентарь не найден'));
            }

            if (inventory.userId !== req.user.id && req.user.role !== 'ADMIN') { 
                return next(ApiError.forbidden('У вас нет прав для редактирования'));
            }

            await inventory.destroy();
            return res.json({ message: 'Инвентарь удален' });
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }
}

module.exports = new InventoryController();