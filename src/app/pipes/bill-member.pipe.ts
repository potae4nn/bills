import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'billMember'
})
export class BillMemberPipe implements PipeTransform {

  transform(value: any): any {
    let data = JSON.parse(value);
    let result;
    try {
      result = data.member.map(function (obj: any) {
        return obj.id_member
      })
    } catch (error) {
      // console.log(error);
    }
    return result;
  }

}
