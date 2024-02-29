import { IVehicle } from '@/@types/vehicle';
import { VehiclesRepository } from '@/repositories/vehicles-repository';

type Params = Partial<IVehicle>

export class UpdateVehicleUseCase {

    constructor(
        private repository: VehiclesRepository,
    ) { }

    async execute(_id: string, data: Params): Promise<void> {
        await this.repository.update(_id, data);
    }

}