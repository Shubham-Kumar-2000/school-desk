const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('./init');

const AdminTeacher = sequelize.define(
    'AdminTeacher',
    {
        _id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: 'admin_teachers', // Customize table name if needed
        timestamps: true, // Adds createdAt and updatedAt automatically
        hooks: {
            beforeCreate: async (admin, options) => {
                const saltRounds = Number(process.env.SALT_ROUNDS) || 12;
                admin.password = await bcrypt.hash(admin.password, saltRounds);
            },
            beforeUpdate: async (admin, options) => {
                if (admin.changed('password')) {
                    // Check if password was changed
                    const saltRounds = Number(process.env.SALT_ROUNDS) || 12;
                    admin.password = await bcrypt.hash(
                        admin.password,
                        saltRounds
                    );
                }
            }
        }
    }
);

AdminTeacher.prototype.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

AdminTeacher.checkIfUserExists = async function (email, password) {
    const admin = await AdminTeacher.findOne({ where: { email } });
    if (!admin) {
        return null;
    }
    if (!(await admin.comparePassword(password))) return null;
    return admin.get({ plain: true });
};

module.exports = AdminTeacher;
