import { MongoCasaRepository } from '@/repositories/mongo/mongo-casa-repository';
import { CreateCasaUseCase } from '@/use-cases/Casa/create-casa';
import { Validator } from '@/utils/validator';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

const schema = z.object({
  _id: z.string().optional(),
  name: z.string().optional(),
  descriptionCapa: z.string().optional(),
  tipoLocacao: z.string().optional(),
  garagem: z
    .object({
      vagas: z.number(),
    })
    .optional(),
  banheiro: z
    .object({
      banheiro: z.number(),
      lavabo: z.number(),
    })
    .optional(),
  cozinha: z.number().optional(),
  tipo: z.string().optional(),
  salas: z.string().optional(),
  dormitorio: z
    .object({
      dormitorio: z.number(),
      suite: z.number(),
    })
    .optional(),
  sacada: z.number().optional(),
  elevador: z.boolean().optional(),
  areaServico: z.boolean().optional(),
  churrasqueira: z.boolean().optional(),
  iframeLocalizacao: z.string().optional(),
  observacao: z.string().optional(),
  metrosQuadrados: z.number().optional(),
  valorLocacao: z.number().optional(),
  codImovel: z.number().optional(),

  archivedAt: z.string().optional(),
});

export async function createCasa(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    // console.log('request.body', request.body);
    const validator = new Validator(schema);
    validator.parse(request.body);
    console.log('request.body', request.body);

    const casaRepository = new MongoCasaRepository();
    const createCasaUseCase = new CreateCasaUseCase(casaRepository);

    const data = await createCasaUseCase.execute(request.body);

    response.status(200).json(data);
  } catch (e) {
    console.log(e);
    next(e);
  }
}
