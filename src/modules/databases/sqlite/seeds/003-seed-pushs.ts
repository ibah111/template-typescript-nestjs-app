import { QueryInterface } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = ({ context }) =>
  context.sequelize.transaction((t) =>
    Promise.all([
      context.sequelize.models.Push.bulkCreate(
        [
          { r_module_id: 1, probability: 80 },
          { r_module_id: 2, probability: 60 },
          ],
        { transaction: t },
      ),
    ]),
  );
