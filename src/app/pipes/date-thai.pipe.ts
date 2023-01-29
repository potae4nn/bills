import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateThai'
})
export class DateThaiPipe implements PipeTransform {

  transform(data: any): unknown {
    const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const days = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
    let d = new Date(data);
    // console.log(d.getHours()+':'+d.getMinutes());
    const day = days[d.getDay()];
    const month = months[d.getMonth()];
    const date = d.getDate();
    const year = d.getFullYear() + 543;

    const minutes = d.getMinutes();
    let conMinuts;
    if(minutes<10){
      conMinuts = '0'+minutes;
    }else{
      conMinuts = minutes;
    }
    let dateThai = day +' '+date+' '+month+' '+year+' '+d.getHours()+':'+conMinuts+' น.';
    return dateThai;
  }

}
