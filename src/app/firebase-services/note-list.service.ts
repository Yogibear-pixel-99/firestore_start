import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
  orderBy
} from '@angular/fire/firestore';
import { Note } from '../interfaces/note.interface';
import { Observable, timestamp } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoteListService {
  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  markedNotes: Note[] = [];

  unsubNotes;
  unsubTrash;
  unsubMarked;

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubNotes = this.subNoteList();
    this.unsubTrash = this.subTrashList();
    this.unsubMarked = this.subMarkedList();
  }

  subNoteList() {
    let ref = collection(this.firestore, "notes/7l7RShD3WlOU5EFYYrZk/notesExtra");
    return onSnapshot(ref, (list) => {
      this.normalNotes = [];
      list.forEach((element) => {
        this.normalNotes.push(this.setNoteObj(element.data(), element.id));
        console.log(this.setNoteObj(element.data(), element.id));
      });
        list.docChanges().forEach((change) => {
    if (change.type === "added") {
        console.log("New note: ", change.doc.data());
    }
    if (change.type === "modified") {
        console.log("Modified note: ", change.doc.data());
    }
    if (change.type === "removed") {
        console.log("Removed note: ", change.doc.data());
    }
  });
    });
  }

  // subNoteList() {
  //   const q = query(
  //     this.getNotesRef(),
  //   );
  //   return onSnapshot(q, (list) => {
  //     this.normalNotes = [];
  //     list.forEach((element) => {
  //       this.normalNotes.push(this.setNoteObj(element.data(), element.id));
  //       console.log(this.setNoteObj(element.data(), element.id));
  //     });
  //       list.docChanges().forEach((change) => {
  //   if (change.type === "added") {
  //       console.log("New note: ", change.doc.data());
  //   }
  //   if (change.type === "modified") {
  //       console.log("Modified note: ", change.doc.data());
  //   }
  //   if (change.type === "removed") {
  //       console.log("Removed note: ", change.doc.data());
  //   }
  // });
  //   });
  // }



  subMarkedList() {
    const q = query(this.getNotesRef(), where("marked", "==", true));
    return onSnapshot(q, (list) => {
      this.markedNotes = [];
      list.forEach((element) => {
        this.markedNotes.push(this.setNoteObj(element.data(), element.id));
        console.log(this.setNoteObj(element.data(), element.id));
      });
    });
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach((element) => {
        this.trashNotes.push(this.setNoteObj(element.data(), element.id));
      });
    });
  }

  ngOnDestroy() {
    this.unsubNotes();
    this.unsubTrash();
    this.unsubMarked();
  }

  setNoteObj(obj: any, id: string): Note {
    return {
      id: id,
      type: obj.type || 'note',
      title: obj.title || '',
      content: obj.content || '',
      marked: obj.marked || false,
    };
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getNoteOrTrashRef(docId: string) {
    return collection(this.firestore, docId);
  }

  getSingleDocRef(collId: string, docId: string) {
    return doc(collection(this.firestore, collId), docId);
  }

  async addNote(item: Note) {
    await addDoc(this.getNoteOrTrashRef(item.type), item)
      .catch((err) => {
        console.error(err);
      })
      .then((docRef) => {
        console.log('Document written with ID: ', docRef);
      });
  }

  async updateNote(item: Note) {
    if (item.id) {
      try {
        let docRef = this.getSingleDocRef(
          this.getCollIdFromNote(item),
          item.id
        );
        await updateDoc(docRef, this.getCleanJson(item));
      } catch (err) {
        console.error('Error adding document: ', err);
      }
    }
  }

  async deleteNote(collId: 'notes' | 'trash', docId: string) {
    try {
      await deleteDoc(this.getSingleDocRef(collId, docId));
    } catch (err) {
      console.error('Error deleting document: ', err);
    }
  }

  getCleanJson(note: Note) {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    };
  }

  getCollIdFromNote(note: Note) {
    if (note.type === 'notes') {
      return 'notes';
    } else {
      return 'trash';
    }
  }
}
