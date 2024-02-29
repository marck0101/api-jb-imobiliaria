import { TripProps } from '@/@types/trips';
import { TripsRepository } from '@/repositories/trips-repository';
import { DuplicateConflictError } from '@/utils';

export class CreateTripUseCase {
  constructor(private repository: TripsRepository) {}

  async execute(data: TripProps) {
    if (data.vehicle) {
      // Verifica se o veículo já está sendo usado no banco
      const existingTrips = await this.repository.getVehicle(data.vehicle);
      // console.log('createTrip buscaVehicleUsado', existingTrips);

      // Verifica se há alguma sobreposição de datas
      let canCreate = true;
      existingTrips.forEach((existingTrip) => {
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
      });

      if (!canCreate) {
        throw new DuplicateConflictError({
          UIDescription: {
            'pt-br': 'Veículo já existe com outra viagem no mesmo período!',
          },
        });
      }
    }

    const trip = await this.repository.create(data);
    // console.log('trip', trip);

    return trip;
  }
}
