import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { UsersService, IUsers } from '../../services/users.service';
import { Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-send-bill',
  templateUrl: './send-bill.component.html',
  styleUrls: ['./send-bill.component.css']
})
export class SendBillComponent implements OnInit {
  @ViewChild('imagesFile') myInputVariable!: ElementRef;
  public number: number[] = [];
  public user_name: string = '';
  public typeBill: any[] = [];
  public typeUser: any[] = [];
  public price: number = 0;
  public imageSrcShow: any;
  public imageSrc: any;

  public billForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private usersService: UsersService) {

    this.billForm = this.fb.group({
      user_name: new FormControl('', Validators.required),
      user_id: ['', Validators.required],
      tel: ['-'],
      file: ['', Validators.required],
      type_user_id: ['', Validators.required],
      bill_type_id: ['', Validators.required],
      quantity_users: [1, Validators.required],
      price: [0, Validators.required],
      user_type: [''],
      member: this.fb.array([]),
      // quantities: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.usersService.getUserType().subscribe(res => {
      this.typeUser = res.data
    })

    this.numberHF(1)
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

  public numberHF(num: number) {
    for (let i = num; i <= 20; i++) {
      // console.log(i);
      this.number.push(i);
    }
  }

  public async onChange() {
    const price = await this.calBill(this.billForm.get("bill_type_id")?.value) * await this.billForm.get("quantity_users")?.value;
    this.billForm.get("price")?.setValue(price);
    this.addQuantity(this.billForm.value.quantity_users)
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
      that.billForm.get("file")?.setValue(result);
      that.imageSrc = result; //Base64 รูปภาพ ที่ย่อขนาดแล้ว
    };
    // this.imageSrc = result;
    img.src = URL.createObjectURL(file);
  }

  // quantities(): FormArray {
  //   return this.billForm.get("quantities") as FormArray
  // }

  // newQuantity(): FormGroup {
  //   return this.fb.group({
  //     qty: '',
  //     price: '',
  //   })
  // }

  public mamber(): FormArray {
    return this.billForm.get("member") as FormArray
  }

  public newMember(): FormGroup {
    return this.fb.group({
      id_member: ['', Validators.required]
    })
  }

  public addQuantity(num: number) {
    // this.quantities().clear();
    this.mamber().clear();
    for (let index = 1; index < num; index++) {
      if (num == 1) return;
      this.mamber().push(this.newMember());
    }
    // this.quantities().push(this.newQuantity());
  }

  public removeQuantity(i: number) {
    // this.quantities().removeAt(i);
  }

  public onPercentChange(e: any) {
    // console.log(e.target.value)
    const id_user = e.target.value
    if (id_user.length == 0) {
      this.clearForm(); return;
    }
    if (id_user.length >= 6) {
      try {
        this.usersService.seachUser(id_user)
          .subscribe((res: any) => {
            // console.log(res);
            if (res.instances[0] == null) {
              // this.billForm.get("user_name")?.setValue('ไม่พบข้อมูล')  
              // this.billForm.valid;
            } else {
              this.billForm.get("user_name")?.setValue(res.instances[0].name);
              this.billForm.get("tel")?.setValue(res.instances[0].tel);
              this.billForm.get("user_type")?.setValue(res.instances[0].memberType.name)
            }
          })
      } catch (error) {
        console.log('ไม่มีอะ');
      }
    }
  }

  public onChangeTypeUser(id: any) {
    let id_type_user = id.target.value;
    this.usersService.getBillType(id_type_user).subscribe(res => {
      this.typeBill = res.data
    })
  }

  public clearForm() {
    this.billForm.reset();
    this.resetImageScr();
  }

  public onSubmit() {
    // console.log(this.billForm.value);
    this.usersService.sendBill(this.billForm.value)
      .subscribe(res => {
        // console.log(res);
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

  public resetImageScr() {
    this.imageSrcShow = '';
    this.imageSrc = '';
    this.myInputVariable.nativeElement.value = '';
    this.billForm.get("file")?.setValue('');
  }



}
