import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { ElectronicPoint } from './models/electronicPoint.model';

@Injectable({
  providedIn: 'root'
})
export class IndexDBService extends Dexie {

  private ElectronicPointData: Dexie.Table<ElectronicPoint, number>;

  constructor() {
    super('MyDatabase');
    this.version(1).stores({
      myData: '++id, data, horaInicio, horaAlmoco, horaRetornoAlmoco, horaFinal, comentarios'
    });
    this.ElectronicPointData = this.table('myData');
  }

  addData(data: ElectronicPoint) {
    return this.ElectronicPointData.add(data);
  }

  getAllData() {
    return this.ElectronicPointData.toArray();
  }

  updateData(id: number, newData: ElectronicPoint) {
    return this.ElectronicPointData.update(id, newData);
  }

  async deleteData(id: number) {
    return this.ElectronicPointData.delete(id);
  }

  async getByDate(data: string): Promise<number | null> {
    const existingData = await this.ElectronicPointData.where('data').equals(data).first();

    if (existingData) {
      return existingData.id!;
    }

    return null;
  }
}
