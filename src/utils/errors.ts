import { logger } from './logger';

type Level =
  | 'error'
  | 'emergency'
  | 'alert'
  | 'critical'
  | 'warning'
  | 'notice'
  | 'info'
  | 'debug';
export interface ErrorDescription {
  en?: string;
  'pt-br'?: string;
}
interface DefaultErrorParams {
  status?: number;
  level?: Level;
  data?: object;
  description?: ErrorDescription;
  UIDescription?: ErrorDescription;
  errors?: object | undefined;
  path?: string | undefined;
  details?: Array<object | string> | undefined;
}

export class DefaultError extends Error {
  status: number;
  level: Level;
  data: object;
  description: ErrorDescription;
  UIDescription: ErrorDescription;
  errors: object | undefined;
  path: string | undefined;
  details: Array<object | string>;

  constructor(message: string, options: DefaultErrorParams = {}) {
    super(message);
    this.status = options.status || 400;
    this.level = options.level || 'error';
    this.data = options.data || {};
    this.description = options.description || {};
    this.UIDescription = options.UIDescription || {};
    this.errors = options.errors;
    // this.path = options.path || this.stack.split('\n').filter(c => !c.includes('node_modules')).join('\n')
    this.path = options.path || this.stack;
    this.details = options.details || [];
    this.log();
  }

  log() {
    const log = {
      level: this.level || 'error',
      message: this.message,
      path: this.path,
      data: {},
    };
    if (this.data && Object.keys(this.data).length) log.data = this.data;
    logger.log(log);
  }
}

interface ErrorParams {
  path?: string | undefined;
  status?: number;
  data?: object;
  UIDescription?: ErrorDescription;
  description?: ErrorDescription;
  details?: Array<object>;
}

export class UnknownError extends DefaultError {
  constructor(params: ErrorParams = {}) {
    const data: DefaultErrorParams = {
      description: {
        en: 'An unexpected error occurred while processing your request. Please try again later or contact our support team for assistance.',
        'pt-br':
          'Um erro inesperado ocorreu enquanto seu pedido era processado. Por favor, tente novamente mais tarde ou entre em contato com o suporte.',
      },
      status: 500,
      level: 'emergency',
      UIDescription: {
        'pt-br': 'Um imprevisto ocorreu.',
      },
    };
    if (params.path) data.path = params.path;
    super('Internal Server Error', data);
  }
}

export class DuplicateConflictError extends DefaultError {
  constructor(params: ErrorParams = {}) {
    super('Duplicate conflict.', {
      description: {
        en: 'The request can not be completed because the resource or process already exists.',
        'pt-br':
          'A solicitação não pode ser concluída pois o recurso ou processo já existe',
      },
      level: 'notice',
      status: params.status || 409,
      data: params.data || {},
      UIDescription: params.UIDescription || {
        'pt-br': 'O objeto ou processo já existe ou está duplicado.',
      },
    });
  }
}

export class ResourceNotFoundError extends DefaultError {
  constructor(params: ErrorParams = {}) {
    super('Resource not found.', {
      description: {
        en: 'The server could not find the requested resource.',
        'pt-br': 'O servidor não encontrou o recurso requisitado.',
      },
      level: 'notice',
      status: params.status || 404,
      data: params.data || {},
      UIDescription: params.UIDescription || {
        'pt-br': 'O servidor não conseguiu encontrar o recurso solicitado.',
      },
    });
  }
}

export class ResourceExpiredError extends DefaultError {
  constructor(params: ErrorParams = {}) {
    super('Resource expired.', {
      description: {
        en: 'The server may have found the requested resource. But refuses to execute it because it expired.',
        'pt-br':
          'O servidor pode ter encontrado o recurso requisitado. Mas se recusa a executa-lo pois expirou.',
      },
      level: 'notice',
      status: params.status || 410,
      data: params.data || {},
      UIDescription: params.UIDescription || {
        'pt-br': 'O recurso solicitado já expirou.',
      },
    });
  }
}

export class InvalidCredentialsError extends DefaultError {
  constructor(params: ErrorParams = {}) {
    super('Invalid Credentials.', {
      description: {
        en: 'The provided credentials are invalid or missing.',
        'pt-br': 'As credenciais fornecidas são inválidas ou estão faltando.',
      },
      level: 'warning',
      status: params.status || 401,
      data: params.data || {},
      UIDescription: params.UIDescription || {
        'pt-br': 'Credenciais inválidas ou faltantes',
      },
    });
  }
}

export class ValidationError extends DefaultError {
  constructor(params: ErrorParams = {}) {
    super('Invalid data.', {
      description: params.description
        ? params.description
        : {
            en: 'The request contains semantic errors or invalid data that prevents processing.',
            'pt-br':
              'A solicitação contém inconsistências semânticas ou dados inválidos que estão impedindo o processamento adequado.',
          },
      level: 'warning',
      status: params.status || 422,
      data: params.data || {},
      UIDescription: params.UIDescription || {
        'pt-br': 'A requisição é invalida.',
      },
      details: params.details || [],
    });
  }
}

export class ResourceUnavailableError extends DefaultError {
  constructor(params: ErrorParams = {}) {
    super('Resource is currently unavailable.', {
      description: params.description
        ? params.description
        : {
            en: 'The resource you are trying to access is currently unavailable.',
            'pt-br':
              'O recurso que você está tentando acessar não está disponível no momento.',
          },
      level: 'info',
      status: params.status || 422,
      data: params.data || {},
      UIDescription: params.UIDescription || {
        'pt-br': 'Recurso não disponível no momento.',
      },
    });
  }
}

export class AuthenticationError extends DefaultError {
  constructor(params: ErrorParams = {}) {
    super('Request unauthorized.', {
      description: {
        en: 'The request requires user authentication or the authentication has failed.',
        'pt-br':
          'A solicitação requer autenticação do usuário ou a autenticação falhou.',
      },
      level: 'warning',
      status: params.status || 401,
      data: params.data || {},
      UIDescription: params.UIDescription || {
        'pt-br':
          'A solicitação requer autenticação do usuário ou a autenticação falhou.',
      },
    });
  }
}

export class AuthorizationError extends DefaultError {
  constructor(params: ErrorParams = {}) {
    super('Action execution refused due to a permissions violation.', {
      description: {
        en: 'The server understood the request, but refuses to authorize it.',
        'pt-br':
          'O servidor entendeu a solicitação, mas se recusa a autorizá-la.',
      },
      status: params.status || 403,
      data: params.data || {},
      UIDescription: params.UIDescription || {
        'pt-br': 'A solicitação chegou, mas não foi autorizada.',
      },
    });
  }
}

export class DatabaseError extends DefaultError {
  constructor(params: ErrorParams = {}) {
    super('An error occurred while accessing or querying the database.', {
      description: {
        en: 'An error occurred while accessing or querying the database.',
        'pt-br': 'Ocorreu um erro ao acessar ou consultar o banco de dados.',
      },
      level: 'critical',
      status: params.status || 500,
      data: params.data || {},
      UIDescription: params.UIDescription || {
        'pt-br': 'Ocorreu um erro ao acessar o banco de dados.',
      },
    });
  }
}
