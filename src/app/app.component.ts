import { Component, OnInit, ViewChild } from '@angular/core';
import { IndexDBService } from './indexDBservice.service';
import { ElectronicPoint } from './models/electronicPoint.model';
import { MatDrawer } from '@angular/material/sidenav';
import * as Utils from './utils/utils';

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
  showFiller = false;
  isSideNavOpened = false;
  journeySizeInMinutes = 8 * 60;
  myDataList: ElectronicPoint[] = [];

  @ViewChild('drawer', { static: true }) drawer: MatDrawer | undefined;

  constructor(private IndexDBService: IndexDBService) {}

  async ngOnInit() {
    await this.refreshData();
  }

  async refreshData() {
    await this.IndexDBService.getAllData().then((data) => {
      this.myDataList = data;

      const dayData = this.myDataList.find(
        (obj) => obj.data === Utils.formatDate(new Date())
      );

      if (dayData) {
        this.startTime = dayData.horaInicio;
        this.lunchTime = dayData.horaAlmoco;
        this.lunchEndTime = dayData.horaRetornoAlmoco;
        this.endTime = dayData.horaFinal;
        this.comment = dayData.comentarios;
        this.actualDay = dayData.data;
        this.calculateTimeSum();
      }

      console.log(this.myDataList);
    });
  }
  calculateTimeSum() {
    const duracaoTotalEmMinutos = this.journeySizeInMinutes;

    const chegadaEmMinutos =
      this.startTime != '' ? Utils.horarioParaMinutos(this.startTime) : null;
    const saidaAlmocoEmMinutos =
      this.lunchTime != '' ? Utils.horarioParaMinutos(this.lunchTime) : null;
    const voltaAlmocoEmMinutos =
      this.lunchEndTime != ''
        ? Utils.horarioParaMinutos(this.lunchEndTime)
        : null;
    let horarioFinalEmMinutos =
      this.endTime != '' ? Utils.horarioParaMinutos(this.endTime) : null;

    if (
      chegadaEmMinutos &&
      saidaAlmocoEmMinutos &&
      voltaAlmocoEmMinutos &&
      !horarioFinalEmMinutos
    ) {
      const duracaoAteAlmoco = saidaAlmocoEmMinutos - chegadaEmMinutos;
      const tempoRestante = duracaoTotalEmMinutos - duracaoAteAlmoco;

      const horarioFinalEmMinutos = voltaAlmocoEmMinutos + tempoRestante;
      this.endTime = Utils.minutosParaHorario(horarioFinalEmMinutos);
    }

    horarioFinalEmMinutos = Utils.horarioParaMinutos(this.endTime);

    if (
      chegadaEmMinutos &&
      saidaAlmocoEmMinutos &&
      voltaAlmocoEmMinutos &&
      horarioFinalEmMinutos
    ) {
      const duracaoAteAlmoco = saidaAlmocoEmMinutos - chegadaEmMinutos;
      const duracaoAposAlmoco = horarioFinalEmMinutos - voltaAlmocoEmMinutos;

      const duracaoTotalEmMinutos = duracaoAteAlmoco + duracaoAposAlmoco;

      this.timesum = Utils.minutosParaHorario(duracaoTotalEmMinutos);
    }

    if (
      chegadaEmMinutos &&
      saidaAlmocoEmMinutos &&
      !voltaAlmocoEmMinutos &&
      !horarioFinalEmMinutos
    ) {
      const duracaoAteAlmoco = saidaAlmocoEmMinutos - chegadaEmMinutos;

      this.timesum = Utils.minutosParaHorario(duracaoAteAlmoco);
    }

    if (
      !chegadaEmMinutos &&
      !saidaAlmocoEmMinutos &&
      voltaAlmocoEmMinutos &&
      horarioFinalEmMinutos
    ) {
      const duracaoAposAlmoco = horarioFinalEmMinutos - voltaAlmocoEmMinutos;

      this.timesum = Utils.minutosParaHorario(duracaoAposAlmoco);
    }

    if (
      chegadaEmMinutos &&
      !saidaAlmocoEmMinutos &&
      !voltaAlmocoEmMinutos &&
      horarioFinalEmMinutos
    ) {
      const duracaoTotalEmMinutos = horarioFinalEmMinutos - chegadaEmMinutos;

      this.timesum = Utils.minutosParaHorario(duracaoTotalEmMinutos);
    }

    if (this.timesum) {
      this.resultColor =  Utils.getResultColor(Number.parseInt(this.timesum.split(':')[0]));
    }
  }

  deleteData(id: number | undefined) {
    if (id) {
      void this.IndexDBService.deleteData(id).then(() => {
        void this.refreshData();
      });
    }
  }

  async saveComment(event: any) {
    this.comment = event.target.value;
    await this.updateData();
  }

  async updateData() {
    const id = await this.IndexDBService.getByDate(Utils.formatDate(new Date()));

    this.calculateTimeSum();

    const newData: ElectronicPoint = {
      data: Utils.formatDate(new Date()),
      horaInicio: this.startTime,
      horaAlmoco: this.lunchTime,
      horaRetornoAlmoco: this.lunchEndTime,
      horaFinal: this.endTime,
      comentarios: this.comment,
      saldo: this.timesum !== "" ? Utils.horarioParaMinutos(this.timesum) - this.journeySizeInMinutes : 0,
    };

    if (id) {
      await this.IndexDBService.updateData(id, newData);
    } else {
      await this.IndexDBService.addData(newData);
    }

    await this.refreshData();
  }

  clean() {
    this.startTime = '';
    this.lunchTime = '';
    this.lunchEndTime = '';
    this.endTime = '';
    this.timesum = '';
    this.resultColor = '';

    void this.IndexDBService.getByDate(Utils.formatDate(new Date())).then(
      (id) => {
        if (id != null && id != undefined) {
          void this.IndexDBService.deleteData(id);
          void this.refreshData();
        }
      }
    );
  }

  toggleDrawer() {
    if (this.drawer) {
      void this.drawer.toggle();
      this.isSideNavOpened = !this.isSideNavOpened;
    }
  }

  minutosParaHoras(minutos: number) {
    minutos = Math.abs(minutos);
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;

    if (minutosRestantes > 0) return horas.toString() + ":" + (minutosRestantes < 10 ? "0" : "") + minutosRestantes.toString();
    else return horas.toString()


  }
}
