import { MongoCasaRepository } from '@/repositories/mongo/mongo-casa-repository'
import { CreateCasaUseCase } from '@/use-cases/Casa/create-casa'
import { Validator } from '@/utils/validator'
import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

const schema = z.object({
  _id: z.string().optional(),
  name: z.string().optional(),
  // descriptionCapa: z.string().optional(),
  // tipoLocacao: z.string().optional(),
  // garagem: z.string().optional(),
  // banheiro: z.string().optional(),
  // cozinha: z.string().optional(),
  // tipo: z.number().optional(),
  // salas: z.string().optional(),
  // dormitorio: z.string().optional(),
  // sacada: z.string().optional(),
  // elevador: z.string().optional(),
  // areaServico: z.string().optional(),
  // churrasqueira: z.string().optional(),

  // iframeLocalizacao: z.string().optional(),
  // observacao: z.string().optional(),
  // metrosQuadrados: z.string().optional(),
  // valorLocacao: z.string().optional(),
  // codImovel: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export async function createCasa(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    // console.log('request.body', request.body);
    const validator = new Validator(schema)
    validator.parse(request.body)
    console.log('request.body', request.body)

    const casaRepository = new MongoCasaRepository()
    const createCasaUseCase = new CreateCasaUseCase(casaRepository)

    const data = await createCasaUseCase.execute(request.body)

    response.status(200).json(data)
  } catch (e) {
    console.log(e)
    next(e)
  }
}
