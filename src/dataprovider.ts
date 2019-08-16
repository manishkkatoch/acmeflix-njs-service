
import * as trivialdb from 'trivialdb';

export class FeatureData {
  database: any
  isLoaded: Promise<{}>
  constructor(key: string) {
    this.database = trivialdb.db(key)
    this.isLoaded = this.database.loading
   }
}

export function initFeatureData(key: string): FeatureData {
  return new FeatureData(key)
}
