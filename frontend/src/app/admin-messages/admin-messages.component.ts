import { Component, OnInit } from '@angular/core';
import { MessageService, Message } from '../core/services/message.service';

@Component({
  selector: 'app-admin-messages',
  templateUrl: './admin-messages.component.html',
  styleUrls: ['./admin-messages.component.scss']
})
export class AdminMessagesComponent implements OnInit {
  messages: Message[] = [];
  loading = false;
  errorMsg = '';

  page = 1;
  limit = 20;
  totalPages = 1;
  totalCount = 0;

  statusFilter = '';
  selected: Message | null = null;

  constructor(private messageService: MessageService) {}

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
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Failed to load messages';
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.page = 1;
    this.load();
  }

  view(msg: Message): void {
    this.selected = msg;

    // auto mark as read the first time it's opened
    if (msg.status === 'new') {
      this.messageService.updateStatus(msg._id, 'read').subscribe({
        next: () => (msg.status = 'read'),
      });
    }
  }

  closeDetail(): void {
    this.selected = null;
  }

  markReplied(msg: Message, event?: Event): void {
    event?.stopPropagation();
    this.messageService.updateStatus(msg._id, 'replied').subscribe({
      next: () => (msg.status = 'replied'),
    });
  }

  remove(msg: Message, event?: Event): void {
    event?.stopPropagation();
    if (!confirm(`Delete message from ${msg.name}?`)) return;

    this.messageService.delete(msg._id).subscribe({
      next: () => {
        this.messages = this.messages.filter((m) => m._id !== msg._id);
        this.totalCount--;
        if (this.selected?._id === msg._id) this.selected = null;
      },
      error: (err) => (this.errorMsg = err?.error?.message || 'Failed to delete message'),
    });
  }

  changePage(delta: number): void {
    const next = this.page + delta;
    if (next < 1 || next > this.totalPages) return;
    this.page = next;
    this.load();
  }

  trackById(index: number, msg: Message): string {
    return msg._id;
  }
}