import { IVehicle } from '@/@types/vehicle';
import { VehiclesRepository } from '@/repositories/vehicles-repository';

export class FetchVehiclesUseCase {

    constructor(
        private repository: VehiclesRepository,
    ) { }

    async execute(): Promise<Array<IVehicle>> {
        const vehicles = await this.repository.get({
            archivedAt: { $exists: false }
        });
        return vehicles;
    }

}