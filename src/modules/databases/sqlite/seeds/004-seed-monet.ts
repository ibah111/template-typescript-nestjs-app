import { QueryInterface } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = ({ context }) =>
  context.sequelize.transaction((t) =>
    Promise.all([
      context.sequelize.models.Monetization.bulkCreate(
        [
          { r_module_id: 1, probability: 20 },
          { r_module_id: 2, probability: 40 },
        ],
        { transaction: t },
      ),
    ]),
  );
