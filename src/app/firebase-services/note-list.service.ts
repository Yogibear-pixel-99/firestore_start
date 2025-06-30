import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc } from '@angular/fire/firestore';
import { Note } from '../interfaces/note.interface';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  firestore: Firestore = inject(Firestore);

  constructor() {
    console.log(this.getTrashRef());
  }

getTrashRef(){
  return collection(this.firestore, 'trash');
}

getNotesRef(){
  return collection(this.firestore, 'notes');
}

getSingleDocRef(collId:string, docId:string){
  return doc(collection(this.firestore, collId), docId);
}

}
