/// <reference types="express" />
import { Express } from 'express';
import { N9Micro } from './index';
export default function ({path, log}: N9Micro.Options, app: Express): Promise<void>;
