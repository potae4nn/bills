import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UsersService, IDateStartEnd } from '../../services/users.service';
import { Subject } from 'rxjs';
import { urlImage, LOGO_SUT, LOGO_SHC, FONT_SUT } from '../../../app.url';

import { jsPDF } from "jspdf";
import { DataTableDirective } from 'angular-datatables';
import { io } from "socket.io-client";
// import * as moment from 'moment';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnDestroy, OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement?: DataTableDirective;
  public dtOptions: any = {};
  public dtTrigger: any = new Subject();
  public data: any[] = [];
  public urlImage = urlImage + "/upload/bills/";
  public naturalWidth: number = 2000;
  public naturalHeight: number = 2000;
  public dateForm: IDateStartEnd = {
    dateStart: '',
    dateEnd: ''
  }

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.dtOptions = {
      order: [[0, 'desc']],
      pageLength: 25,
      pagingType: 'full_numbers',
      destroy: true,
      language: {
        info: "รายการ _START_ ถึง _END_ ทั้งหมด _TOTAL_ รายการ",
        search: 'ค้นหา',
        lengthMenu: 'แสดง _MENU_ รายการ',
        paginate: {
          first: 'หน้าแรก',
          last: "หน้าสุดท้าย",
          next: "ถัดไป",
          previous: "ย้อนกลับ"
        },
      },
    };
    this.getBill(this.dateForm);
  }

  public getBill(dateForm: any) {
    this.usersService.getBill(dateForm)
      .subscribe((res) => {
        this.data = res.data;
        this.dtTrigger.next();
      })
  }


  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  public async printData(data: any) {
    const img = this.urlImage + data.image;
    const textSplit = await this.splitText(data)
    let results = {
      data: data,
      textSplit
    }
    await this.getDataUri(img, results, this.createPDF);
  }

  public getDataUri(url: string, result: any, callback: any) {
    console.log(result);
    const image = new Image();
    const that = this;

    image.setAttribute('crossOrigin', 'anonymous'); //getting images from external domain
    image.onload = function () {
      const canvas = document.createElement('canvas');
      let scale = Math.min(that.naturalWidth / canvas.width, that.naturalHeight / canvas.height);
      let iwScaled = canvas.width * scale;
      let ihScaled = canvas.height * scale;

      canvas.width = iwScaled;
      canvas.height = ihScaled;

      //next three lines for white background in case png has a transparent background
      var ctx = canvas.getContext('2d');
      ctx?.drawImage(image, 0, 0, iwScaled, ihScaled);
      callback(canvas.toDataURL('image/jpeg'), result.data, result.textSplit);
    };
    image.src = url;
  }

  public createPDF(image: any, data: any, textSplit: any) {
    const doc = new jsPDF();

    let result = JSON.parse(data.bill_member);
    let resultData;
    try {
      resultData = result.member.map(function (obj: any) {
        return obj.id_member
      })
    } catch (error) {
      console.log(error);
    }
    // console.log(resultData);

    doc.addFileToVFS('SUT Regular ver 1.00-normal.ttf', FONT_SUT);
    doc.addFont('SUT Regular ver 1.00-normal.ttf', 'SUT Regular ver 1.00', 'normal');
    doc.setFont("SUT Regular ver 1.00");
    // var font = doc.getFont();
    // debugger;
    doc.addImage(LOGO_SUT, 'JPEG', 80, 10, 17, 20);
    doc.addImage(LOGO_SHC, 'JPEG', 100, 10, 22, 22);
    doc.setFontSize(20);
    doc.text('สถานกีฬาและสุขภาพ มหาวิทยาลัยเทคโนโลยีสุรนารี', 50, 40);
    doc.setFontSize(18);
    doc.text('สลิปโอนเงินค่าสมาชิก ' + data.name_type, 55, 50);
    doc.text('รหัสสมาชิก: ' + data.user_id, 55, 58);
    doc.text('ชื่อ-สกุล: ' + data.user_name, 55, 66);
    doc.text('ประเภท: ' + data.user_type, 55, 74);
    doc.text('เบอร์โทร: ' + data.tel, 55, 82);
    doc.text("จำนวนผู้สมัคร: " + data.quantity_users + " ท่าน", 55, 90)
    if (data.quantity_users > 1) {
      doc.text("รหัสสมาชิกที่ร่วมจ่าย: " + resultData, 55, 98)
      doc.text('จำนวนเงิน: ' + data.price + ' บาท', 55, 106);
      doc.addImage(image, 'jpg', 60, 112, 80, 140);
    } else {
      doc.text('จำนวนเงิน: ' + data.price + ' บาท', 55, 98);
      doc.addImage(image, 'jpg', 60, 106, 80, 140);
    }
    if(textSplit === true){
      doc.setFontSize(13);
      doc.text("(ให้ความยินยอมการใช้ข้อมูลส่วนบุคคล(Consent) ตามกฏหมาย PDPA ในเอกสารแล้ว)", 43, 255)
    }
    doc.setFontSize(16);
    doc.text("ลงชื่อ.................................................................ผู้สมัคร ", 10, 270)
    doc.text("(" + data.user_name + ") ", 20, 278)
    doc.text("ลงชื่อ.................................................................ผู้รับสมัคร ", 118, 270)
    doc.text("(" + localStorage.getItem('fname') + '  ' + localStorage.getItem('lname') + ") ", 129, 278)
    doc.output("dataurlnewwindow");
  }

  public async splitText(data: any): Promise<any> {
    var dataSplit = data.user_id.slice(0, 1);
    if (dataSplit === "S") {
      return true;
    } else {
      return false;
    }
  }


  public async billMember(value: any) {
    let data = JSON.parse(value);
    let result;
    try {
      result = data.member.map(function (obj: any) {
        return obj.id_member
      })
    } catch (error) {
      console.log(error);
    }
    console.log(result);
    return await result;
  }

}
