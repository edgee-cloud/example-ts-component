/** This file is needed to load .ts files by Mocha (without experimental warnings) */
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('ts-node/esm', pathToFileURL('./'));