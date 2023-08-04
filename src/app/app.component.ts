import {Component, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ponto-eletronico';
  startTime = "";
  lunchTime = "";
  lunchEndTime = "";
  endTime = "";
  timesum = "";
  resultColor = ""

  setResultColor(horas: number){

    if(horas < 1){
      this.resultColor = "#a72828"
    } else if (horas >= 2 && horas < 4){
      this.resultColor = "#a75528"
    } else if (horas >= 4 && horas < 6){
      this.resultColor = "#a7a528"
    } else if (horas >= 6 && horas < 8){
      this.resultColor = "#63a728"
    } else if (horas == 8){
      this.resultColor = "#28A745"
    } else if (horas > 8 && horas < 10) {
      this.resultColor = "#28a774"
    } else this.resultColor = "#2881a7"
  }

  calculateHours(){
    const chegada = new Date(`2023-08-04T${this.startTime}:00`);
    const saidaAlmoco = new Date(`2023-08-04T${this.lunchTime}:00`);
    const voltaAlmoco = new Date(`2023-08-04T${this.lunchEndTime}:00`);
    const horarioFinal = new Date(`2023-08-04T${this.endTime}:00`);

    const milissegundosAteAlmoco = saidaAlmoco.getTime() - chegada.getTime();
    const milissegundosAposAlmoco = horarioFinal.getTime() - voltaAlmoco.getTime();

    const milissegundosTotais = milissegundosAteAlmoco + milissegundosAposAlmoco;
    const horasTotais = Math.floor(milissegundosTotais / 3600000); // 1 hora = 3600000 milissegundos
    const minutosTotais = Math.floor((milissegundosTotais % 3600000) / 60000); // 1 minuto = 60000 milissegundos


    this.timesum = `${horasTotais.toString().padStart(2, '0')}:${minutosTotais.toString().padStart(2, '0')}`;
    this.setResultColor(horasTotais);
  }

  clean(){
    this.startTime = "";
    this.lunchTime = "";
    this.lunchEndTime = "";
    this.endTime = "";
    this.timesum = "";
    this.resultColor = "";
  }

}
