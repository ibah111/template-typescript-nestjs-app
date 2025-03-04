import { QueryInterface } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = ({ context }) =>
  context.sequelize.transaction((t) =>
    Promise.all([
      context.sequelize.models.Module.bulkCreate(
        [{ r_geo_id: 1 }, { r_geo_id: 2 }],
        { transaction: t },
      ),
    ]),
  );
