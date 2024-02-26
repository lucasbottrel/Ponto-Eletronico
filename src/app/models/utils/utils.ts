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
