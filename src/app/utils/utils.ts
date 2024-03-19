export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês é baseado em zero
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function createDateTimeWithFormat(timeString: string, dateString: string): Date | null {
  const timeParts = timeString.split(':');
  const dateParts = dateString.split('/');

  if (timeParts.length === 2 && dateParts.length === 3) {
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Mês é baseado em zero
    const year = parseInt(dateParts[2], 10);

    // Verifique se as partes são valores numéricos válidos
    if (!isNaN(hours) && !isNaN(minutes) && !isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month, day, hours, minutes);
    }
  }

  return null; // Retorna null se a conversão não for bem-sucedida
}

export function somarHoras(hora1: string, hora2: string) {
  const [hora1Parte, minutos1Parte] = hora1.split(":").map(Number);
  const [hora2Parte, minutos2Parte] = hora2.split(":").map(Number);

  let totalHoras = hora1Parte + hora2Parte;
  let totalMinutos = minutos1Parte + minutos2Parte;

  // Ajuste se os minutos ultrapassarem 60
  if (totalMinutos >= 60) {
    totalHoras += Math.floor(totalMinutos / 60);
    totalMinutos %= 60;
  }

  // Formatação para garantir dois dígitos em horas e minutos
  const horasFormatadas = totalHoras.toString().padStart(2, '0');
  const minutosFormatados = totalMinutos.toString().padStart(2, '0');

  return `${horasFormatadas}:${minutosFormatados}`;
}

export function subtrairHoras(hora1: string, hora2: string) {
  const [hora1Parte, minutos1Parte] = hora1.split(":").map(Number);
  const [hora2Parte, minutos2Parte] = hora2.split(":").map(Number);

  let totalHoras = hora1Parte - hora2Parte;
  let totalMinutos = minutos1Parte - minutos2Parte;

  // Ajuste se os minutos forem negativos
  if (totalMinutos < 0) {
    totalHoras -= 1;
    totalMinutos += 60;
  }

  // Formatação para garantir dois dígitos em horas e minutos
  const horasFormatadas = totalHoras.toString().padStart(2, '0');
  const minutosFormatados = totalMinutos.toString().padStart(2, '0');

  return `${horasFormatadas}:${minutosFormatados}`;
}

export function horarioParaMinutos(horario: string): number {
  const [horas, minutos] = horario.split(':').map(Number);
  return horas * 60 + minutos;
}

export function minutosParaHorario(minutos: number): string {
  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;

  const horasFormatadas = horas < 10 ? `0${horas}` : `${horas}`;
  const minutosFormatados = minutosRestantes < 10 ? `0${minutosRestantes}` : `${minutosRestantes}`;

  return `${horasFormatadas}:${minutosFormatados}`;
}

export function converterHorarioParaDecimal(horario: string): number {
  const [horas, minutos] = horario.split(':').map(Number);

  // Calcula o equivalente em decimal
  const horarioDecimal = horas + minutos / 60;

  return horarioDecimal;
}

export function converterDecimalParaHorario(decimal: number): string {
  const horas = Math.floor(decimal);
  const minutos = Math.round((decimal % 1) * 60);

  // Formata os valores para o formato hh:mm
  const horasFormatadas = horas < 10 ? `0${horas}` : `${horas}`;
  const minutosFormatados = minutos < 10 ? `0${minutos}` : `${minutos}`;

  return `${horasFormatadas}:${minutosFormatados}`;
}

export function getResultColor(horas: number) : string {
  if (horas <= 1) {
    return '#a72828';
  } else if (horas >= 2 && horas < 4) {
    return '#a75528';
  } else if (horas >= 4 && horas < 6) {
    return '#a7a528';
  } else if (horas >= 6 && horas < 8) {
    return '#63a728';
  } else if (horas == 8) {
    return '#28A745';
  } else if (horas > 8 && horas < 10) {
    return '#28a774';
  } else return '#2881a7';
}

export function minutosParaHoras(minutos: number) {
  // Divide os minutos por 60 para obter o número de horas
  const horas = Math.floor(minutos / 60);
  // Calcula os minutos restantes após a conversão para horas
  const minutosRestantes = minutos % 60;
  // Formata a saída para exibir horas e minutos
  return horas.toString() + "h " + minutosRestantes.toString() + "min";
}
