export interface ICustomer {
  _id: string;

  name: string;
  fantasyname: string;
  email: string;
  birthdate: string;
  cpf: string;
  cnpj: string;
  createdAt: string;
  phone: string;
  rg: string;
  updatedAt: string;

  takerIndicator: string;
  borrowerRegistration: string;

  address: {
    cep: string;
    city: string;
    number: string;
    state: string;
    street: string;
    bairro: string;
  };
  createdAt: string;
  updatedAt: string;
  archivedAt: string;
  files: Array<{
    name: string;
    url: string;
  }>;
}
