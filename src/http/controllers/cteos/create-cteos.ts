import { MongoCteosRepository } from '@/repositories/mongo/mongo-cteos-repository';
import { MongoVehiclesRepository } from '@/repositories/mongo/mongo-vehicles-repository';
import { CreateCteosUseCase } from '@/use-cases/cteos/create-cteos';
import { Validator } from '@/utils/validator';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

const schema = z.object({
  cfop: z.string().nonempty(),

  bairro_tomador: z.string().nonempty(),
  logradouro_tomador: z.string().nonempty(),
  cep_tomador: z.string().nonempty(),
  codigo_municipio_tomador: z.string().nonempty(),
  municipio_tomador: z.string().nonempty(),
  uf_tomador: z.string().nonempty(),
  numero_tomador: z.string().nonempty(),

  cnpj_tomador: z.string().optional(),
  cpf_tomador: z.string().optional(),
  nome_fantasia_tomador: z.string().optional(),
  nome_tomador: z.string().nonempty(),

  codigo_municipio_fim: z.string().nonempty(),
  codigo_municipio_inicio: z.string().nonempty(),
  descricao_servico: z.string().nonempty(),
  indicador_inscricao_estadual_tomador: z.string().nonempty(),
  municipio_fim: z.string().nonempty(),
  municipio_inicio: z.string().nonempty(),
  natureza_operacao: z.string().nonempty(),

  tipo_servico: z.enum(['6', '7', '8']),
  uf_fim: z.string().nonempty(),
  uf_inicio: z.string().nonempty(),
  valor_receber: z.number().min(0),
  valor_total: z.number().min(0),
  modal_rodoviario: z.string().nonempty(),
  percursos: z.array(z.unknown()).optional(),
});

export async function createCteos(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const validator = new Validator(schema);
    validator.parse(request.body);

    const vehiclesRepository = new MongoVehiclesRepository();
    const cteosRepository = new MongoCteosRepository();

    const createCteosUseCase = new CreateCteosUseCase(
      vehiclesRepository,
      cteosRepository,
    );
    const result = await createCteosUseCase.execute(request.body);

    response.status(result.status || 200).json(result.data);
  } catch (e) {
    next(e);
  }
}
