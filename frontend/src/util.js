const util = {
  timestampFromDateAndTime: ({ date, time }) => {
    const [yearPart, monthPart, datePart] = date.split('-').map(Number);
    const [hourPart, minutePart] = time.split(':').map(Number);
    const d = new Date(0);
    d.setYear(yearPart);
    d.setMonth(monthPart - 1);
    d.setDate(datePart);
    d.setHours(hourPart);
    d.setMinutes(minutePart);
    const timestamp = d.getTime();
    return timestamp;
  },
  timeStampToYMD: (timestamp) => {
    const date = new Date(Number(timestamp));
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  },
  timeStampToYMDHM: (timestamp) => { 
    const date = new Date(Number(timestamp));
    const hours = date.getHours();
    let hoursAdjusted = hours === 0 ? 12 : hours;
    const hoursPart = hoursAdjusted.toString().padStart(2, '0');
    const minutesPart = date.getMinutes().toString().padStart(2, '0');
    const ampmPart = hours < 12 ? 'AM' : 'PM';
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}` +
      ` ${hoursPart}:${minutesPart} ${ampmPart}`;
  },
  durationToHM: (duration) => {
    const durationMinutes = (duration || 0) / (60 * 1000);
    const durationHours = Math.floor(durationMinutes / 60);
    const durationMinutesPastHour = durationMinutes - durationHours * 60;
    const durationDisplay = `${durationHours} hours, ${durationMinutesPastHour} minutes`;
    return durationDisplay;
  },
  fileToBase64: (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString() || '');
    reader.onerror = reject;
  })  
};

export default util;
