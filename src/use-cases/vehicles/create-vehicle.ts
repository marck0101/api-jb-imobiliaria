import { IVehicle } from '@/@types/vehicle'
import { VehiclesRepository } from '@/repositories/vehicles-repository'

type Params = Omit<IVehicle, 'createdAt' | 'updatedAt' | '_id' | 'archivedAt'>

export class CreateVehicleUseCase {
  constructor(private repository: VehiclesRepository) {}

  async execute(data: Params): Promise<IVehicle> {
    // console.log('data', data);
    const vehicle = await this.repository.create(data)
    return vehicle
  }
}
