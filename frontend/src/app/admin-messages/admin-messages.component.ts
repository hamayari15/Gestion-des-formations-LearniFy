import { Component, OnInit } from '@angular/core';
import { MessageService, Message } from '../core/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-messages',
  templateUrl: './admin-messages.component.html',
  styleUrls: ['./admin-messages.component.css']
})
export class AdminMessagesComponent implements OnInit {
  messages: Message[] = [];
  loading = false;
  errorMsg = '';

  page = 1;
  limit = 20;
  totalPages = 1;
  totalCount = 0;
  newCount = 0;

  statusFilter = '';
  searchTerm = '';
  selected: Message | null = null;

  showDetailMobile = false;

  constructor(
    private messageService: MessageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMsg = '';

    this.messageService.getAll(this.page, this.limit, this.statusFilter || undefined).subscribe({
      next: (res) => {
        this.messages = res.data;
        this.totalPages = res.pagination.pages;
        this.totalCount = res.pagination.total;
        this.newCount = res.newCount;
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || this.translate.instant('ADMIN_MESSAGES.ERROR_LOAD');
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.page = 1;
    this.selected = null;
    this.showDetailMobile = false;
    this.load();
  }

  get filteredMessages(): Message[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.messages;
    return this.messages.filter(
      (m) =>
        m.name.toLowerCase().includes(term) ||
        m.email.toLowerCase().includes(term) ||
        m.message.toLowerCase().includes(term)
    );
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'new': return 'ADMIN_MESSAGES.STATUS_NEW';
      case 'read': return 'ADMIN_MESSAGES.STATUS_READ';
      case 'replied': return 'ADMIN_MESSAGES.STATUS_REPLIED';
      default: return status;
    }
  }

  view(msg: Message): void {
    this.selected = msg;
    this.showDetailMobile = true;

    if (msg.status === 'new') {
      this.messageService.updateStatus(msg._id, 'read').subscribe({
        next: () => {
          msg.status = 'read';
          this.newCount = Math.max(0, this.newCount - 1);
        },
      });
    }
  }

  backToList(): void {
    this.showDetailMobile = false;
  }

  markReplied(msg: Message, event?: Event): void {
    event?.stopPropagation();
    this.messageService.updateStatus(msg._id, 'replied').subscribe({
      next: () => (msg.status = 'replied'),
      error: (err) => (this.errorMsg = err?.error?.message || this.translate.instant('ADMIN_MESSAGES.ERROR_UPDATE_STATUS')),
    });
  }

  remove(msg: Message, event?: Event): void {
    event?.stopPropagation();

    Swal.fire({
      icon: 'warning',
      title: this.translate.instant('ADMIN_MESSAGES.DELETE_CONFIRM_TITLE'),
      text: this.translate.instant('ADMIN_MESSAGES.DELETE_CONFIRM_TEXT', { name: msg.name }),
      width: 500,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('ADMIN_MESSAGES.DELETE_CONFIRM_BTN'),
      cancelButtonText: this.translate.instant('ADMIN_MESSAGES.DELETE_CANCEL_BTN'),
      confirmButtonColor: '#dc2626',
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.messageService.delete(msg._id).subscribe({
        next: () => {
          this.messages = this.messages.filter((m) => m._id !== msg._id);
          this.totalCount--;
          if (this.selected?._id === msg._id) {
            this.selected = null;
            this.showDetailMobile = false;
          }

          Swal.fire({
            icon: 'success',
            title: this.translate.instant('ADMIN_MESSAGES.DELETE_SUCCESS_TITLE'),
            text: this.translate.instant('ADMIN_MESSAGES.DELETE_SUCCESS_TEXT'),
            width: 500,
            timer: 2000,
            timerProgressBar: true,
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: this.translate.instant('ADMIN_MESSAGES.ERROR_DELETE'),
            text: err?.error?.message || '',
            width: 500,
          });
        },
      });
    });
  }

  changePage(delta: number): void {
    const next = this.page + delta;
    if (next < 1 || next > this.totalPages) return;
    this.page = next;
    this.selected = null;
    this.showDetailMobile = false;
    this.load();
  }

  trackById(index: number, msg: Message): string {
    return msg._id;
  }
}