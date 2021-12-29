import { Util } from '@magento/peregrine/lib/index';
const { BrowserPersistence } = Util;

const storage = new BrowserPersistence();

export const checkValidToken = () => !!storage.getItem('signin_token');

export const getToken = () => storage.getItem('signin_token');
