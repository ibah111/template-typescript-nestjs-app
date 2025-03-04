import { QueryInterface } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = ({ context }) =>
  context.sequelize.transaction((t) =>
    Promise.all([
      context.sequelize.models.Geolocation.bulkCreate(
        [
          { region_name: 'RU', probability: 33 },
          { region_name: 'US', probability: 33 },
          { region_name: 'KZ', probability: 33 },
        ],
        { transaction: t },
      ),
    ]),
  );
