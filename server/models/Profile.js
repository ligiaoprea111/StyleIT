export default (sequelize, DataTypes) => {
    const Profile = sequelize.define(
      "Profile",
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING(1000),
          allowNull: true,
        },
        profilePicture: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        location: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        birthday: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
      },
      {
        timestamps: false, // nu avem createdAt și updatedAt
      }
    );
  
    return Profile;
  };
  