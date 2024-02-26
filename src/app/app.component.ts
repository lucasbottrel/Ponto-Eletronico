import { Component, OnInit } from '@angular/core';
import { IndexDBService } from './indexDBservice.service';
import { ElectronicPoint } from './models/electronicPoint.model';
import * as Utils from './models/utils/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ponto-eletronico';
  startTime = '';
  lunchTime = '';
  lunchEndTime = '';
  endTime = '';
  timesum = '';
  resultColor = '';
  comment = '';
  actualDay = '';
  saldoDiario = 0;
  myDataList: ElectronicPoint[] = [];

  constructor(private IndexDBService: IndexDBService) {}

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData() {
    void this.IndexDBService.getAllData().then(data => {
      this.myDataList = data;
      console.log(this.myDataList);

      const dayData = this.myDataList.find(obj => obj.data === Utils.formatDate(new Date()));

      if (dayData) {
        this.startTime = dayData.horaInicio;
        this.lunchTime = dayData.horaAlmoco;
        this.lunchEndTime = dayData.horaRetornoAlmoco;
        this.endTime = dayData.horaFinal;
        this.comment = dayData.comentarios;
        this.actualDay = dayData.data;
        this.calculateTimeSum();
      }

    });
  }
  calculateTimeSum() {
    const duracaoTotal = 8 * 60 * 60 * 1000; // 8 horas = 8 * 60 minutos * 60 segundos * 1000 milissegundos

    const chegada = Utils.createDateTimeWithFormat(this.startTime, this.actualDay)
    const saidaAlmoco = Utils.createDateTimeWithFormat(this.lunchTime, this.actualDay)
    const voltaAlmoco = Utils.createDateTimeWithFormat(this.lunchEndTime, this.actualDay)
    let horarioFinal = Utils.createDateTimeWithFormat(this.endTime, this.actualDay)
    let horasTotais = 0;
    let minutosTotais = 0;

    if (chegada && saidaAlmoco && voltaAlmoco && !horarioFinal) {
      const duracaoAlmoco = voltaAlmoco.getTime() - saidaAlmoco.getTime();
      const tempoTotalTrabalho = duracaoTotal + duracaoAlmoco;

      const horarioFinalEmMilissegundos =
        chegada.getTime() + tempoTotalTrabalho;
      const horarioFinal = new Date(horarioFinalEmMilissegundos);

      this.endTime = `${horarioFinal
        .getHours()
        .toString()
        .padStart(2, '0')}:${horarioFinal
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
    }

    horarioFinal = Utils.createDateTimeWithFormat(this.endTime, this.actualDay)

    if (chegada && saidaAlmoco && voltaAlmoco && horarioFinal) {
      const milissegundosAteAlmoco = saidaAlmoco.getTime() - chegada.getTime();
      const milissegundosAposAlmoco =
        horarioFinal.getTime() - voltaAlmoco.getTime();

      const milissegundosTotais =
        milissegundosAteAlmoco + milissegundosAposAlmoco;
      horasTotais = Math.floor(milissegundosTotais / 3600000); // 1 hora = 3600000 milissegundos
      minutosTotais = Math.floor((milissegundosTotais % 3600000) / 60000); // 1 minuto = 60000 milissegundos

      this.timesum = `${horasTotais.toString().padStart(2, '0')}:${minutosTotais
        .toString()
        .padStart(2, '0')}`;
    }

    if (chegada && saidaAlmoco && !voltaAlmoco && !horarioFinal){
      const milissegundosAteAlmoco = saidaAlmoco.getTime() - chegada.getTime();

      horasTotais  = Math.floor(milissegundosAteAlmoco / 3600000); // 1 hora = 3600000 milissegundos
      minutosTotais = Math.floor((milissegundosAteAlmoco % 3600000) / 60000); // 1 minuto = 60000 milissegundos

      this.timesum = `${horasTotais.toString().padStart(2, '0')}:${minutosTotais
        .toString()
        .padStart(2, '0')}`;
    }

    if (!chegada && !saidaAlmoco && voltaAlmoco && horarioFinal){
      const milissegundosAposAlmoco =
        horarioFinal.getTime() - voltaAlmoco.getTime();

      horasTotais = Math.floor(milissegundosAposAlmoco / 3600000); // 1 hora = 3600000 milissegundos
      minutosTotais = Math.floor((milissegundosAposAlmoco % 3600000) / 60000); // 1 minuto = 60000 milissegundos

      this.timesum = `${horasTotais.toString().padStart(2, '0')}:${minutosTotais
        .toString()
        .padStart(2, '0')}`;
    }

    if (chegada && !saidaAlmoco && !voltaAlmoco && horarioFinal){
      const milissegundosTotal =
        horarioFinal.getTime() - chegada.getTime();

      horasTotais = Math.floor(milissegundosTotal / 3600000); // 1 hora = 3600000 milissegundos
      minutosTotais = Math.floor((milissegundosTotal % 3600000) / 60000); // 1 minuto = 60000 milissegundos

      this.timesum = `${horasTotais.toString().padStart(2, '0')}:${minutosTotais
        .toString()
        .padStart(2, '0')}`;
    }

    this.saldoDiario = (horasTotais * 60 + minutosTotais) - 8 * 60;
    this.setResultColor(horasTotais);
  }

  deleteData(id: number | undefined) {
    if (id) {
      void this.IndexDBService.deleteData(id).then(() => {
        this.refreshData();
      });
    }
  }

  setResultColor(horas: number) {
    if (horas == 1) {
      this.resultColor = '#a72828';
    } else if (horas >= 2 && horas < 4) {
      this.resultColor = '#a75528';
    } else if (horas >= 4 && horas < 6) {
      this.resultColor = '#a7a528';
    } else if (horas >= 6 && horas < 8) {
      this.resultColor = '#63a728';
    } else if (horas == 8) {
      this.resultColor = '#28A745';
    } else if (horas > 8 && horas < 10) {
      this.resultColor = '#28a774';
    } else if (horas > 10) this.resultColor = '#2881a7';
  }


  async calculateHours() {
    await this.updateData();
  }

  async saveComment(event: any){
    this.comment = event.target.value
    await this.updateData();
  }

  async updateData(){

    const id = await this.IndexDBService.getByDate(Utils.formatDate(new Date()));

    const newData: ElectronicPoint = {
      data: Utils.formatDate(new Date()),
      horaInicio: this.startTime,
      horaAlmoco: this.lunchTime,
      horaRetornoAlmoco: this.lunchEndTime,
      horaFinal: this.endTime,
      comentarios: this.comment,
      saldo: this.saldoDiario
    }

    if (id) {
      await this.IndexDBService.updateData(id, newData).then(() => {
        this.refreshData();
      });

    } else {
      await this.IndexDBService.addData(newData).then(() => {
        this.refreshData();
      });
    }

  }

  clean() {
    this.startTime = '';
    this.lunchTime = '';
    this.lunchEndTime = '';
    this.endTime = '';
    this.timesum = '';
    this.resultColor = '';

    void this.updateData();
  }

  minutosParaHorario(totalMinutos: number): string {
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;

    const horasStr = horas.toString().padStart(2, '0');
    const minutosStr = minutos.toString().padStart(2, '0');

    return `${horasStr}:${minutosStr}`;
  }
}
