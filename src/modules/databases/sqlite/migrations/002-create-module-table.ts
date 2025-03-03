import { DataTypes, QueryInterface } from 'sequelize';
import { MigrationFn } from 'umzug';

const tableName = 'modules';

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
          r_geo_id: {
            allowNull: false,
            type: DataTypes.STRING,
            references: {
              model: 'geolocations',
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
