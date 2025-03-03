import { DataTypes, QueryInterface } from 'sequelize';
import { MigrationFn } from 'umzug';

const tableName = 'Pushs';

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
          r_module_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'modules',
              key: 'id',
            },
            onDelete: 'CASCADE',
          },
          probability: {
            type: DataTypes.FLOAT,
            allowNull: false,
          },
          createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: new Date(),
          },
          updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: new Date(),
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
