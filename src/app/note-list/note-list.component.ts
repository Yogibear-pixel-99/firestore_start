import { Component } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { NoteListService } from '../firebase-services/note-list.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NoteComponent } from './note/note.component';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [FormsModule, CommonModule, NoteComponent],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.scss',
})
export class NoteListComponent {
  noteList: Note[] = [];
  favFilter: 'all' | 'fav' = 'all';
  status: 'notes' | 'trash' = 'notes';

  constructor(private noteService: NoteListService) {
    this.debugger();
  }

  debugger() {
    setInterval(() => console.log(this.favFilter), 1000);
  }

  changeFavFilter(filter: 'all' | 'fav') {
    this.favFilter = filter;
  }

  changeTrashStatus() {
    if (this.status == 'trash') {
      this.status = 'notes';
    } else {
      this.status = 'trash';
      this.favFilter = 'all';
    }
  }

  getList(): Note[] {
    if (this.favFilter === 'fav') {
      return this.noteService.markedNotes;
    } else if (this.status === 'trash') {
      return this.noteService.trashNotes;
    } else {
      return this.noteService.normalNotes;
    }
  }

  getTrash(): Note[] {
    return this.noteService.trashNotes;
  }

  getMarked(): Note[] {
    return this.noteService.markedNotes;
  }
}
