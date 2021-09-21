import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DbConnectionService {

  // backend connection settings
  backendPort = 3000;
  url = 'http://localhost:' + this.backendPort;

  constructor(private http: HttpClient) {
  }

  // create HTTP header with webtoken
  getTokenHeader(token: string){
    return new HttpHeaders().set('x-access-token', token);
  }

  /**
   * sign user in
   * @param email
   * @param password
   * @returns http response promise
   */
  signIn(email: string, password: string){
    return this.http.post(`${this.url}/api/auth/signin`, {'email': email, 'password': password}).toPromise();
  }

  /**
   * sign user up (creates user)
   * @param fields (not required)
   *  @field firstName
   *  @field lastName
   *  @field password
   *  @field email
   *  @field gender
   *  @field address
   *  @field birthDate
   *  @field phoneNumber
   * @returns http response promise
   */
  signUp(fields: Object){
    return this.http.post(`${this.url}/api/auth/signup`, fields).toPromise();
  }

  /**
   * get userdata
   * @param id userID
   * @param userToken webtoken
   * @returns http response promise
   */
  getUserData(id: number, userToken: string){
    return this.http.get(`${this.url}/api/userdata?id=${id}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * update userdata
   * @param id userID
   * @param userToken webtoken
   * @param fields (not required)
   *  @field firstName
   *  @field lastName
   *  @field email
   *  @field gender
   *  @field address
   *  @field birthDate
   *  @field phoneNumber
   * @returns http response promise
   */
  postUserData(id: number, userToken: string, fields: Object){
    return this.http.post(`${this.url}/api/userdata?id=${id}`, fields, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * change password
   * @param oldPassword
   * @param newPassword
   * @param userToken webtoken
   * @returns http response promise
   */
  changePassword(oldPassword: string, newPassword: string, userToken: string){
    return this.http.post(`${this.url}/api/user/changePassword`, {oldPassword: oldPassword, newPassword: newPassword}, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * get all listings
   * @returns http response promise
   */
  getAllListings(){
    return this.http.get(`${this.url}/api/listings`).toPromise();
  }

  /**
   * get all listings made by given user
   * @param userId userID
   * @returns http response promise
   */
  getUserListings(userId: number){
    return this.http.get(`${this.url}/api/listings/user?id=${userId}`).toPromise();
  }

  /**
   * create listing
   * @param userToken webtoken
   * @param fields (not required)
   *  @field name
   *  @field description
   *  @field availableAssets
   *  @field startDate
   *  @field price
   *  @field picture: image in base64 format
   * @returns http response promise
   */
  createListing(userToken: string, fields: Object){
    return this.http.post(`${this.url}/api/listing/create`, fields, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * get listingdata
   * @param id listingID
   * @returns http response promise
   */
  getListing(id: number){
    return this.http.get(`${this.url}/api/listing?id=${id}`).toPromise();
  }

  /**
   * update listingdata
   * @param id listingID
   * @param userToken webtoken
   * @param fields (not required)
   *  @field name
   *  @field description
   *  @field availableAssets
   *  @field startDate
   *  @field price
   *  @field picture: image in base64 format
   * @returns http response promise
   */
  postListing(id: number,  userToken: string, fields: Object){
    return this.http.post(`${this.url}/api/listing?id=${id}`, fields, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * delete listing
   * @param id listingID
   * @param userToken webtoken
   * @returns http response promise
   */
  deleteListing(id: number,  userToken: string){
    return this.http.get(`${this.url}/api/listing/delete?id=${id}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * get all bookings on a given listing
   * @param listingID listingID
   * @param userToken webtoken
   * @returns http response promise
   */
  getListingBookings(listingID: number, userToken: string){
    return this.http.get(`${this.url}/api/bookings/listing?id=${listingID}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * get all bookings made by given user
   * @param userToken webtoken
   * @returns http response promise
   */
  getUserBookings(userToken: string){
    return this.http.get(`${this.url}/api/bookings/user`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * create booking
   * @param userToken webtoken
   * @param fields
   *  @field listingID
   *  @field numberOfAssets
   * @returns http response promise
   */
  createBooking(userToken: string, fields: Object){
    return this.http.post(`${this.url}/api/booking/create`, fields, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * cancels booking (doesn't delete)
   * @param bookingID bookingID
   * @param userToken webtoken
   * @returns http response promise
   */
  cancelBooking(bookingID: number, userToken: string){
    return this.http.get(`${this.url}/api/booking/cancel?id=${bookingID}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * confirm payment of booking
   * @param bookingID bookingID
   * @param userToken webtoken
   * @returns http response promise
   */
  confirmPayment(bookingID: number, userToken: string){
    return this.http.get(`${this.url}/api/booking/confirmPayment?id=${bookingID}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }
}
