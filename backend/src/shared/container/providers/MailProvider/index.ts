import { container } from 'tsyringe';
import IMailProvider from './models/IMailProvider';
import EtherealMailProvider from './implementations/EtherealMailProvider';

const providers = {
  mail: EtherealMailProvider,
};

container.registerInstance<IMailProvider>(
  'EtherealMailProvider',
  container.resolve(providers.mail),
);
