module.exports = (sequelize, Sequelize) => {
  const Contact = sequelize.define("contact", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    phoneNumber: {
      type: Sequelize.STRING,
      allowNull: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true
    },
    linkedId: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    linkPrecedence: {
      type: Sequelize.ENUM,
      values: ['primary', 'secondary'],
      allowNull: false,
      defaultValue: 'primary'
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    deletedAt: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    timestamps: true, 
    paranoid: true    
  });

  return Contact;
};
