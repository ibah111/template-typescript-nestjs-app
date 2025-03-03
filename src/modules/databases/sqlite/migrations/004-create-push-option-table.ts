import { DataTypes, QueryInterface } from 'sequelize';
import { MigrationFn } from 'umzug';

const tableName = 'PushOptions';

export const up: MigrationFn<QueryInterface> = ({ context }) =>
  context.sequelize.transaction((t) =>
    Promise.all([
      context.createTable(
        tableName,
        {
          id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          probability: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          r_push_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'Pushs',
              key: 'id',
            },
            onDelete: 'CASCADE',
          },
          createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
          },
        },
        { transaction: t },
      ),
    ]),
  );
export const down: MigrationFn<QueryInterface> = ({ context }) =>
  context.sequelize.transaction((t) =>
    Promise.all([context.dropTable(tableName, { transaction: t })]),
  );
