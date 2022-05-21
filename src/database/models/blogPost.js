module.exports = (sequelize, DataTypes) => {
  const BlogPost = sequelize.define('BlogPost', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  });

  BlogPost.associate = (models) => {
    BlogPost.belongsTo(models.User, {
      as: 'users',
      foreignKey: 'id',
    });
  };

  return BlogPost;
};