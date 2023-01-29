import { Injectable } from '@angular/core';
import { url, apiKey, urlService, token } from '../../app.url';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private urlSeachUser: string = `${urlService}`;
  private urlAddBill: string = `${url}/bill/addBill`;
  private urlSendBill: string = `${url}/bill/sendBill`;
  // private urlTypeBill: string = `${url}/bill/getTypeBill`;
  private urlTypeUser: string = `${url}/bill/getTypeUser`;
  private urlBill: string = `${url}/bill`;
  // private urlGetBill: string = `${url}/bill/getBill`;
  private urlSignin:string = `${url}/bill/auth`;


  constructor(private httpClient: HttpClient) { }

  public seachUser(id_user: any): any {
    // console.log(id_user)
    let send;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNjMwMzMiLCJqdGkiOiIzMTI3Mzc4Ni04ZWVkLTRhZjQtOGIzMi1iYjg0NTRmYmU4ZjgiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMjYzMDMzIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjpbIlN0YWZmIiwiTWVtYmVyIl0sImV4cCI6MTY1NTI4MTQ5MSwiaXNzIjoiU01BUlQtU0hDIiwiYXVkIjoiU1RBRkYifQ.0ClLxPWQS25qSDrqXN82DI0-LUruN4loKoOf0XoNkGA'
    });
    if (
      id_user === '' ||
      id_user === '/' ||
      id_user === '#' ||
      id_user === '%' ||
      id_user === '?'
    ) {
      console.log(`NO`);
    } else {
      // console.log(`${this.urlSeachUser}/${id_user}`);
      send = this.httpClient.get<any>(`${this.urlSeachUser}/${id_user}`, { headers: headers, withCredentials: true });
    }
    return send;
  }

  public addBill(data: any) {
    // console.log(data);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8', 'API': apiKey });
    return this.httpClient.post<any>(this.urlAddBill, data, { headers: headers });
  }

  public sendBill(data: any) {
    // console.log(data);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8', 'API': apiKey });
    return this.httpClient.post<any>(this.urlSendBill, data, { headers: headers });
  }

  public getBillType(id_type_user: number) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'API': apiKey });
    return this.httpClient.post<any>(this.urlTypeUser, { id_type_user: id_type_user }, { headers: headers });
  }

  public getUserType() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'API': apiKey });
    return this.httpClient.get<any>(this.urlTypeUser, { headers: headers });
  }

  public getBill(resultsDate: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'API': apiKey });
    return this.httpClient.post<any>(this.urlBill, resultsDate, { headers: headers });
  }

  public signin(formSignin: any) {
    return this.httpClient.post<any>(this.urlSignin, formSignin);
  }
}


export interface IUsers {
  id?: number,
  user_id: string,
  user_name: string,
  timestamp?: any,
  user_type: string,
  image: string,
  price?: number,
  tel?: string,
  bill_type_id: number,
  quantity_users: number
}

// export interface ITypebill {
//   data?: ITypebill;
//   id?: number,
//   name:string,
//   price:number,
// }

export interface IDateStartEnd {
  dateStart: string,
  dateEnd: string
}