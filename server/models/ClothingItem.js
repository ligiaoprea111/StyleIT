export default (sequelize, DataTypes) => {
  const ClothingItem = sequelize.define("ClothingItem", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subCategory: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    material: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    season: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isUserUploaded: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    uploadDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  });

  return ClothingItem;
}; 