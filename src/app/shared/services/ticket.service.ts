import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITicket } from '../model/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  constructor(private readonly http: HttpClient) { }

  getTickets(): Observable<Array<ITicket>> {
    return this.http.get<Array<ITicket>>('./assets/tickets.json');
  }

}
