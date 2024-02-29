import { VehiclesRepository } from '@/repositories/vehicles-repository';

export class ArchiveVehicleUseCase {

    constructor(
        private repository: VehiclesRepository,
    ) { }

    async execute(_id: string): Promise<void> {
        await this.repository.archive(_id);
    }

}