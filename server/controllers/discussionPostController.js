const ApiError = require('../error/ApiError');
const { DiscussionPost, Inventory, User } = require('../models/models');

class discussionPostController { 
    async create(req, res, next) { 
        try {
            const { inventoryId } = req.params;
            const { content } = req.body;

            if (!content) { 
                return next(ApiError.badRequest('Контент обязателен'));
            }

            const inventory = await Inventory.findOne({ where: { id: inventoryId } })
            
            if (!inventory) { 
                return next(ApiError.badRequest('Инвентарь не найден'))
            }

            if (!req.user.id) { 
                return next(ApiError.badRequest('Нужна аутентификация'))
            }

            const post = await DiscussionPost.create({
                content,
                inventoryId,
                userId: req.user.id
            })

            return res.json(post);
        } catch (error) {
            return next(ApiError.internal('Ошибка создания поста'))
        }
    }

    async getAll(req, res, next) { 
        try {
            const { inventoryId } = req.params;
            const posts = await DiscussionPost.findAll({ where: { inventoryId } })
            return res.json(posts);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении постов'))
        }
    }

    async like(req, res, next) { 
        try {
            const { id } = req.params;
            const post = await DiscussionPost.findOne({ where: { id } });

            if (!post) { 
                return next(ApiError.badRequest('Пост не найден'));
            }

            const userId = req.user.id;
            const likes = post.likes || {};

            if (likes[userId]) { 
                return next(ApiError.badRequest('Лайк уже был поставлен'));
            }

            likes[userId] = true;
            await post.update({ likes });

            return res.json(post)
        } catch (error) {
            return next(ApiError.internal('Ошибка при лайке'))
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const post = await DiscussionPost.findOne({ where: { id } });

            if (!post) {
                return next(ApiError.badRequest('Пост не найден'));
            }

            if (post.userId !== req.user.id && req.user.role !== 'ADMIN') {
                return next(ApiError.forbidden('Нет прав на удаление поста'));
            }

            await post.destroy();
            return res.json({ message: 'Пост успешно удалён' });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении поста'));
        }
    }
}

module.exports = new discussionPostController();