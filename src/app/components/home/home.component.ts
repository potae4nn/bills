import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsersService, IUsers } from '../../services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('imagesFile') myInputVariable!: ElementRef;
  @ViewChild('type_user_id') myInputTypeUserId!: ElementRef;
  @ViewChild('inputMember') myInputMember!:ElementRef;
  public formUser: IUsers = {
    user_id: '',
    user_name: '',
    user_type: '',
    image: '',
    price: 0,
    tel: '',
    bill_type_id: 0,
    quantity_users: 1
  }

  public inputMember:any = [];

  public numberInput: any = [];

  public imageSrcShow: any;
  public imageSrc: any;
  public number: number[] = [];

  public typeBill: any[] = [];
  public typeUser: any[] = []

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.usersService.getUserType().subscribe(res => {
      this.typeUser = res.data
    })
    this.numberHF(1);
  }

  numberHF(num: number) {
    for (let i = num; i <= 20; i++) {
      // console.log(i);
      this.number.push(i);
    }
  }

  public async onChange() {
    this.formUser.price = await this.calBill(this.formUser.bill_type_id) * await this.formUser.quantity_users;
    // this.counter(this.formUser.quantity_users);
  }

  public calBill(bill_type_id: any) {
    let priceBill: number = 0;
    this.typeBill.filter((el) => {
      if (el.id == Number(bill_type_id)) {
        priceBill = el.price;
      }
    })
    return priceBill;
  }

  public onChangeTypeUser(id: any) {
    let id_type_user = id.target.value;
    this.usersService.getBillType(id_type_user).subscribe(res => {
      // console.log(res.data);
      this.typeBill = res.data
    })
  }

  public counter(length: number): any {
    this.numberInput = [];
    for (let i = 0; i < length; i++) {
      this.numberInput.push(i);
    }
  }

  public textInputMember(event:any){
    console.log(event);
  }

  public onSubmit(e:Event) {
    e.preventDefault();
    let data = {
      file: this.imageSrc,
      formUser: this.formUser
    };
    this.usersService.addBill(data)
      .subscribe(res => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'ส่งใบเสร็จสำเร็จ',
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          this.clearForm();
        });
      })
  }

  public onPercentChange(id_user: any) {
    if (id_user.length == 0) {
      this.clearForm(); return;
    }
    if (id_user.length >= 6) {
      try {
        this.usersService.seachUser(id_user)
          .subscribe((res: any) => {
            if (res.instances[0] == null) {
              this.formUser.user_name = 'ไม่พบข้อมูล';
            } else {
              this.formUser.user_name = res.instances[0].name;
              this.formUser.user_id = res.instances[0].code;
              this.formUser.user_type = res.instances[0].memberType.name;
              this.formUser.tel = res.instances[0].tel;
            }
          })
      } catch (error) {
        console.log('ไม่มีอะ');
      }
    }
  }


  public clearForm() {
    this.formUser.user_id = ''
    this.formUser.user_name = ''
    this.formUser.user_type = ''
    this.formUser.tel = ''
    this.formUser.price = 0
    this.formUser.bill_type_id = 0
    this.formUser.quantity_users = 1
    this.myInputTypeUserId.nativeElement.value = '';
    this.resetImageScr()
  }

  //images 
  public resizeImage(file: any) {
    const maxW = 700; //กำหนดความกว้าง
    const maxH = 900; //กำหนดความสูง

    let canvas = document.createElement('canvas');

    let context = canvas.getContext('2d');

    let img = document.createElement('img');

    let that = this;
    let result = '';

    img.onload = async function () {
      let iw = img.width;
      let ih = img.height;

      let scale = Math.min(maxW / iw, maxH / ih);
      let iwScaled = iw * scale;
      let ihScaled = ih * scale;

      // console.log(ihScaled);
      canvas.width = iwScaled;
      canvas.height = ihScaled;

      context?.drawImage(img, 0, 0, iwScaled, ihScaled);
      result = await canvas.toDataURL('image/jpeg', 0.5);
      // console.log(result);

      result += canvas.toDataURL('image/jpeg', 0.5); //0.5 คือ คุณภาพของรูป ที่ Resize

      that.imageSrc = result; //Base64 รูปภาพ ที่ย่อขนาดแล้ว
    };
    // this.imageSrc = result;
    img.src = URL.createObjectURL(file);
  }

  async readURL(event: any): Promise<void> {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      const reader = new FileReader();

      if (file.type == 'image/png' || file.type == 'image/jpeg') {
        if (file.size <= 4000000) {
          reader.onload = (e) => (this.imageSrcShow = reader.result);
          // reader.onload;
          reader.readAsDataURL(file);
          await this.resizeImage(file);
        } else {
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'ขนาดรูปภาพใหญ่เกินไป',
            showConfirmButton: false,
            timer: 2000,
          });
          file = null;
          this.imageSrc = null;
          this.resetImageScr();
        }
      } else {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'กรุณาเพิ่มข้อมูลรูปภาพเท่านั้น',
          showConfirmButton: false,
          timer: 2000,
        });
        file = null;
        this.imageSrc = null;
        event.target.files = [];
        this.resetImageScr();
      }
    }
  }

  public resetImageScr() {
    this.imageSrcShow = '';
    this.imageSrc = '';
    this.myInputVariable.nativeElement.value = '';
    this.formUser.image = '';
  }



}
