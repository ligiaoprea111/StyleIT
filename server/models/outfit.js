export default (sequelize, DataTypes) => {
  const Outfit = sequelize.define('Outfit', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true, // Date can be optional
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  Outfit.associate = (models) => {
    // An Outfit belongs to one User
    Outfit.belongsTo(models.User, { foreignKey: 'userId' });

    // An Outfit has many ClothingItems through the OutfitItems join table
    Outfit.belongsToMany(models.ClothingItem, {
      through: 'OutfitItems',
      foreignKey: 'outfitId',
      otherKey: 'clothingItemId',
    });
  };

  return Outfit;
}; 