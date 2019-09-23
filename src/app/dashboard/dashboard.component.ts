import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';

import { TicketsService } from '../shared/services';
import { ITicket, TaskStatus, ITicketCategory, TicketType } from '../shared/model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  userTickets: ITicket[];
  status = TaskStatus;
  typeOfTicket = TicketType;
  currentTab = 'tasks';
  segregatedTickets = <ITicketCategory>{};
  userIconStatusClass: string;
  fetchedTickets: Subscription;
  urlWatcher: Subscription;

  constructor(
    private userService: TicketsService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('FactSet | DashBoard');

    // Fetch All tickets
    this.fetchedTickets = this.userService.getTickets().subscribe(tickets => {
      this.userTickets = tickets;
      this.sortTickets(this.userTickets);
      this.userIconStatus(this.segregatedTickets[this.currentTab]);
      this.sortCompletedTickets(this.segregatedTickets[this.currentTab]);
    });

    // Tab Selector through URL
    this.urlWatcher = this.route.fragment.subscribe(fragment => {
      if (fragment) {
        this.currentTab = fragment;
        this.userIconStatus(this.segregatedTickets[this.currentTab]);
        this.sortCompletedTickets(this.segregatedTickets[this.currentTab]);
      }
    });
  }

  // Sorting of Tickets
  sortTickets (tickets) {
    this.segregatedTickets.tasks = this.filterTicketType(tickets, this.typeOfTicket.TASK);
    this.segregatedTickets.bugs = this.filterTicketType(tickets, this.typeOfTicket.BUG);
    this.segregatedTickets.completed = this.filterTicketStatus(tickets, this.status.COMPLETED);
    this.segregatedTickets.in_progress = this.filterTicketStatus(tickets, this.status.IN_PROGRESS);
    this.segregatedTickets.not_started = this.filterTicketStatus(tickets, this.status.NOT_STARTED);
  }

  // Filter Tickets on the basis of their Type "Task" or "Bug"
  filterTicketType (tickets, type) {
    return tickets.filter(ticket => ticket.Type === type);
  }

  // Filter Tickets on the basis of their Status "Completed" or "In Progress" or "Not Started"
  filterTicketStatus (tickets, status) {
    return tickets.filter(ticket => ticket.Status === status);
  }

  changeStatus(e, id) {
    this.updateStatus(id, parseFloat(e.target.value));
    this.userIconStatus(this.segregatedTickets[this.currentTab]);
    this.sortCompletedTickets(this.segregatedTickets[this.currentTab]);
    this.checkView();
  }

  updateStatus (id, value) {
    let index;
    // we can consider binary search too.
    index = this.userTickets.findIndex(ticket => ticket.Id === id);
    this.userTickets[index].Status = value;
    this.sortTickets(this.userTickets);
  }

  statusHighlighter (value) {
    if (value === this.status.COMPLETED) {
      return 'completed';
    } else if (value === this.status.IN_PROGRESS) {
      return 'in_progress';
    } else {
      return 'not_started';
    }
  }

  userIconStatus (tickets) {
    if (tickets) {
      if (tickets.some(ticket => ticket.Status === this.status.IN_PROGRESS)) {
        this.userIconStatusClass = 'user_in_progress';
        return;
      } else if (tickets.some(ticket => ticket.Status === this.status.COMPLETED)) {
        this.userIconStatusClass = 'user_completed';
        return;
      } else {
        this.userIconStatusClass = 'user_not_started';
        return;
      }
    }
  }

  // if current bucket is empty move to either "task" or "bug" bucket
  checkView () {
    if (this.segregatedTickets[this.currentTab] && this.segregatedTickets[this.currentTab].length <= 0) {
      if (this.segregatedTickets['tasks'] &&
        this.segregatedTickets['tasks'].length > 0) { // if "Task" bucket is not empty go to "Tasks" bucket
        this.router.navigateByUrl('/dashboard#tasks');
      } else {
        this.router.navigateByUrl('/dashboard#bugs'); // if Task bucket is also empty go to "Bugs"
      }
    }
  }

  sortCompletedTickets (tickets) {
    if (tickets) {
      tickets.sort(function (a, b) {
        if (a.Status > b.Status) {
          return -1;
        }
        if (a.Status < b.Status) {
          return 1;
        }
        return 0;
      });
    }
  }

  // unsubscribe all subscription
  ngOnDestroy () {
    this.fetchedTickets.unsubscribe();
    this.urlWatcher.unsubscribe();
  }
}
