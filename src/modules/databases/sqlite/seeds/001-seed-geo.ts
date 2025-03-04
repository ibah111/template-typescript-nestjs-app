import { QueryInterface } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = ({ context }) =>
  context.sequelize.transaction((t) =>
    Promise.all([
      context.sequelize.models.Geolocation.bulkCreate(
        [
          { region_name: 'RU', probability: 50 },
          { region_name: 'US', probability: 50 },
        ],
        { transaction: t },
      ),
    ]),
  );
