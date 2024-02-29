import { TripProps } from '@/@types/trips';
import { TripsRepository } from '@/repositories/trips-repository';
import { DuplicateConflictError } from '@/utils';

export class UpdateTripUseCase {
  constructor(private repository: TripsRepository) {}

  async execute(_id: string, data: Partial<TripProps>) {
    // console.log('UPDATE  Usecase');
    // console.log('data', data);
    const trip = await this.repository.getById(_id); // pega apenas o _id para listar na tela

    if (data && data.vehicle && data.startDate && data.endDate) {
      // Verifica se o veículo já está sendo usado no banco
      const existingTrips = await this.repository.getVehicle(data.vehicle);

      const filter = existingTrips.filter((trip) => trip._id != _id);

      // console.log('filter  ===>', filter);

      // Verifica se há alguma sobreposição de datas
      let canCreate = true;
      // console.log('CHEGUEI AQUI', data);

      // if (data?.startDate >= existingTrips[0].startDate) {
      //   console.log('aa');
      // }

      filter.forEach((existingTrip) => {
        if (data.startDate && data.endDate) {
          if (
            (data.startDate >= existingTrip.startDate &&
              data.startDate <= existingTrip.endDate) ||
            (data.endDate >= existingTrip.startDate &&
              data.endDate <= existingTrip.endDate) ||
            (data.startDate <= existingTrip.startDate &&
              data.endDate >= existingTrip.endDate)
          ) {
            // console.log('Não pode cadastrar - sobreposição de datas');
            canCreate = false;
          }
        }
      });

      // console.log('canCreate', canCreate);

      if (!canCreate) {
        throw new DuplicateConflictError({
          UIDescription: {
            'pt-br': 'Veículo já existe com outra viagem no mesmo período!',
          },
        });
      }
    }

    await this.repository.update({ _id }, data);
  }
}
