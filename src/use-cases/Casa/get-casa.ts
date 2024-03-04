import { IVehicle } from '@/@types/vehicle';
import { VehiclesRepository } from '@/repositories/vehicles-repository';
import { ResourceNotFoundError } from '@/utils';

export class GetVehicleUseCase {

    constructor(
        private repository: VehiclesRepository,
    ) { }

    async execute(_id: string): Promise<IVehicle> {
        const vehicle = await this.repository.getById(_id);
        if (!vehicle) {
            throw new ResourceNotFoundError({ data: { _id } });
        }
        return vehicle;
    }

}