module.exports = (sequelize, DataTypes) => {
  const ScheduledOutfit = sequelize.define('ScheduledOutfit', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // This should match the table name for your User model
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    id_outfit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'outfits', // This should match the table name for your Outfit model
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    scheduled_date: {
        type: DataTypes.DATEONLY, // Store only the date
        allowNull: false,
        unique: 'userOutfitDateUnique', // Ensure a user can only schedule one outfit per day
    },
    // Add other fields if needed, e.g., time of day, notes
    // scheduled_time: {
    //     type: DataTypes.TIME,
    //     allowNull: true,
    // },
  }, {
    tableName: 'scheduled_outfits', // Explicitly set table name
    timestamps: true, // Adds createdAt and updatedAt fields
    indexes: [
        {
            unique: true,
            fields: ['id_user', 'scheduled_date'],
            name: 'userOutfitDateUnique',
        }
    ]
  });

  ScheduledOutfit.associate = (models) => {
    ScheduledOutfit.belongsTo(models.User, {
      foreignKey: 'id_user',
      as: 'user',
    });
    ScheduledOutfit.belongsTo(models.Outfit, {
      foreignKey: 'id_outfit',
      as: 'outfit',
    });
  };

  return ScheduledOutfit;
}; 