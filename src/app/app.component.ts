import { Component, SimpleChanges } from '@angular/core';
import { LocalStorageService } from './localStorageService.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ponto-eletronico';
  startTime = '';
  lunchTime = '';
  lunchEndTime = '';
  endTime = '';
  timesum = '';
  resultColor = '';
  comment = '';
  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    let data = this.localStorageService.getData();

    let startTime = data.startTime ? new Date(data.startTime) : null;
    let lunchTime = data.lunchTime ? new Date(data.lunchTime) : null;
    let lunchEndTime = data.lunchEndTime ? new Date(data.lunchEndTime) : null;
    let endTime = data.endTime ? new Date(data.endTime) : null;
    let comment = data.comment ? data.comment : '';

    this.startTime = startTime ? `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}` : '';
    this.lunchTime = lunchTime ? `${lunchTime.getHours().toString().padStart(2, '0')}:${lunchTime.getMinutes().toString().padStart(2, '0')}`: '';
    this.lunchEndTime = lunchEndTime ? `${lunchEndTime.getHours().toString().padStart(2, '0')}:${lunchEndTime.getMinutes().toString().padStart(2, '0')}` : '';
    this.endTime = endTime ? `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}` : '';
    this.timesum = data.timesum ? data.timesum : '';
    this.comment = comment ? comment : '';

    this.setResultColor(Number(this.timesum.split(':')[0]));
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

  calculateHours() {
    // Calcula a duração total do expediente em milissegundos (8 horas)

    // this.saveComment()
    const duracaoTotal = 8 * 60 * 60 * 1000; // 8 horas = 8 * 60 minutos * 60 segundos * 1000 milissegundos

    let chegada = this.startTime
      ? new Date(`2023-08-04T${this.startTime}:00`)
      : null;
    let saidaAlmoco = this.lunchTime
      ? new Date(`2023-08-04T${this.lunchTime}:00`)
      : null;
    let voltaAlmoco = this.lunchEndTime
      ? new Date(`2023-08-04T${this.lunchEndTime}:00`)
      : null;
    let horarioFinal = this.endTime
      ? new Date(`2023-08-04T${this.endTime}:00`)
      : null;

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

    horarioFinal = this.endTime
      ? new Date(`2023-08-04T${this.endTime}:00`)
      : null;

    if (chegada && saidaAlmoco && voltaAlmoco && horarioFinal) {
      const milissegundosAteAlmoco = saidaAlmoco.getTime() - chegada.getTime();
      const milissegundosAposAlmoco =
        horarioFinal.getTime() - voltaAlmoco.getTime();

      const milissegundosTotais =
        milissegundosAteAlmoco + milissegundosAposAlmoco;
      const horasTotais = Math.floor(milissegundosTotais / 3600000); // 1 hora = 3600000 milissegundos
      const minutosTotais = Math.floor((milissegundosTotais % 3600000) / 60000); // 1 minuto = 60000 milissegundos

      this.timesum = `${horasTotais.toString().padStart(2, '0')}:${minutosTotais
        .toString()
        .padStart(2, '0')}`;
      this.setResultColor(horasTotais);
    }

    if (chegada && saidaAlmoco && !voltaAlmoco && !horarioFinal){
      const milissegundosAteAlmoco = saidaAlmoco.getTime() - chegada.getTime();

      const horasTotais = Math.floor(milissegundosAteAlmoco / 3600000); // 1 hora = 3600000 milissegundos
      const minutosTotais = Math.floor((milissegundosAteAlmoco % 3600000) / 60000); // 1 minuto = 60000 milissegundos

      this.timesum = `${horasTotais.toString().padStart(2, '0')}:${minutosTotais
        .toString()
        .padStart(2, '0')}`;
      this.setResultColor(horasTotais);
    }

    if (!chegada && !saidaAlmoco && voltaAlmoco && horarioFinal){
      const milissegundosAposAlmoco =
        horarioFinal.getTime() - voltaAlmoco.getTime();

      const horasTotais = Math.floor(milissegundosAposAlmoco / 3600000); // 1 hora = 3600000 milissegundos
      const minutosTotais = Math.floor((milissegundosAposAlmoco % 3600000) / 60000); // 1 minuto = 60000 milissegundos

      this.timesum = `${horasTotais.toString().padStart(2, '0')}:${minutosTotais
        .toString()
        .padStart(2, '0')}`;
      this.setResultColor(horasTotais);
    }

    this.localStorageService.saveData(chegada, saidaAlmoco, voltaAlmoco, horarioFinal, this.timesum)
  }

  saveComment(event: any){
    this.comment = event.target.value
    console.log(this.comment)
    this.localStorageService.saveComment(this.comment);
  }

  updateData(){
    this.localStorageService.saveData(
      new Date(`2023-08-04T${this.startTime}:00`),
      new Date(`2023-08-04T${this.lunchTime}:00`),
      new Date(`2023-08-04T${this.lunchEndTime}:00`),
      new Date(`2023-08-04T${this.endTime}:00`),
      this.timesum
    )
  }

  clean() {
    this.startTime = '';
    this.lunchTime = '';
    this.lunchEndTime = '';
    this.endTime = '';
    this.timesum = '';
    this.resultColor = '';

    this.localStorageService.clearData();
  }
}
