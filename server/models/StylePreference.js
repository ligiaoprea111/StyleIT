
export default (sequelize, DataTypes) => {
  const StylePreference = sequelize.define("StylePreference", {
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    style_preference: DataTypes.STRING,
    favorite_colors: DataTypes.STRING,
    avoided_colors: DataTypes.STRING,
    outfit_feel: DataTypes.STRING,
    frequent_events: DataTypes.STRING,
    preferred_accessories: DataTypes.STRING,
    body_shape: DataTypes.STRING,
    favorite_items: DataTypes.STRING,
    preferred_materials: DataTypes.STRING,
    dislikes: DataTypes.STRING,
    sex_gender: DataTypes.STRING,
    inspirations: DataTypes.STRING,
    height: DataTypes.STRING,
    weight: DataTypes.STRING
  }, {
    tableName: 'StylePreferences',
    timestamps: true
  });

  return StylePreference;
};
