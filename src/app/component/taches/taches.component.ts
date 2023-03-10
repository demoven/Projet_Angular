import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tache } from 'src/app/model/tache';
import { TachesService } from 'src/app/service/taches.service';
import { UserService } from 'src/app/service/user.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { liste, listeMongo } from 'src/app/model/liste';
import { User } from 'src/app/model/user';
import { lastValueFrom } from 'rxjs';



@Component({
  selector: 'app-taches',
  templateUrl: './taches.component.html',
  styleUrls: ['./taches.component.css']
})
export class TachesComponent implements OnInit {
  listeN: Array<liste> = [];
  newTache: Array<Tache> = [];
  newListe: listeMongo = {
    titre: '',
    taches: [],
  };
  newListe2: liste = {
    titre: '',
    taches: [],
    tachesliste: []
  };
  user: User = {
    login: '',
    password: '',
    listeIds: []
  };
  filter: string = 'Tous';

  constructor(private tacheService: TachesService,
    private userService: UserService,
    private router: Router) { }

  async ngOnInit() {
    try {
      const data = await lastValueFrom(this.userService.userInfos());
      if (data)
        this.user = data;
      const data2 = await lastValueFrom(this.tacheService.getListes(this.user));
      if (data2)
        this.listeN = data2;
      this.listeN.forEach(liste => {
        this.newTache.push({
          titre: '',
          termine: false,
          statut: liste.titre
        });
      });
    } catch (error) {

      this.router.navigate(['login']);
    }
  }

  ajouter(liste: liste) {
    let index = this.listeN.indexOf(liste);
    if (this.newTache[this.listeN.indexOf(liste)].titre == '' || this.newTache[this.listeN.indexOf(liste)].titre == null)
      return;
    this.newTache[index].statut = liste.titre;
    this.tacheService.ajoutTaches(this.newTache[index]).subscribe(
      (data) => {
        liste.tachesliste.push(data);
        if (data._id) {
          liste.taches.push(data._id);
        }
        this.tacheService.updateListes(liste).subscribe({
          next: (data2: liste) => {
            //actualiser la liste
            this.tacheService.getListes(this.user).subscribe({
              next: (data3: Array<liste>) => { this.listeN = data3; }
            });
          }
        });
      }
    );
    this.newTache[index] = {
      titre: '',
      termine: false,
      statut: ''
    };

  }


  ajouterListe() {
    if (this.newListe2.titre == '' || this.newListe2.titre == null)
      return;
    this.newListe.titre = this.newListe2.titre;
    this.newListe.taches = this.newListe2.taches;
    this.tacheService.ajoutListes(this.newListe).subscribe({
      next: (data) => {
        this.listeN.push(data);
        if (data._id) {
          this.user.listeIds.push(data._id);
        }
        this.userService.updateUser(this.user).subscribe({
          next: (data2: User) => {
            //actualiser la liste
            this.tacheService.getListes(this.user).subscribe({
              next: (data3: Array<liste>) => { this.listeN = data3; }
            });
          }
        });
        this.newTache.push({
          titre: '',
          termine: false,
          statut: data.titre
        });
      }
    });
    this.newListe = {
      titre: '',
      taches: [],
    };
    this.newListe2 = {
      titre: '',
      taches: [],
      tachesliste: []
    };

  }


  supprimer(tache: Tache): void {
    this.tacheService.removeTaches(tache).subscribe({
      next: (data) => {
        this.listeN.forEach(liste => {
          liste.tachesliste = liste.tachesliste.filter(t => t._id != tache._id);
          liste.taches = liste.taches.filter(t => t != tache._id);
          this.tacheService.updateListes(liste).subscribe({
            next: (data2: liste) => {
              //actualiser la liste
              this.tacheService.getListes(this.user).subscribe({
                next: (data3: Array<liste>) => { this.listeN = data3; }
              });
            }
          });
        }
        );
      }
    });
  }

  supprimerListe(liste: liste): void {
    for (let tache of liste.tachesliste) {
      this.tacheService.removeTaches(tache).subscribe({
        next: (data) => {
        }
      });
    }

    this.tacheService.removeListes(liste).subscribe({
      next: (data) => {
        let index = this.listeN.indexOf(liste);
        this.user.listeIds = this.user.listeIds.filter(l => liste._id != l);
        this.listeN = this.listeN.filter(l => liste._id != l._id);
        this.newTache.splice(index, 1);
        this.userService.updateUser(this.user).subscribe({
          next: (data2: User) => {
            //actualiser la liste
            this.tacheService.getListes(this.user).subscribe({
              next: (data3: Array<liste>) => { this.listeN = data3; }
            });
          }
        });
      }
    });
  }

  modifier(tache: Tache) {
    tache.termine = !tache.termine;
    this.tacheService.updateTaches(tache).subscribe({
      next: (data) => {
      }
    });
  }

  loggout() {
    this.userService.logout().subscribe(() => {
      this.router.navigate(['']);
    });
    this.user = {
      login: '',
      password: '',
      listeIds: []
    };
  }

  change(filter: string) {
    this.filter = filter;
  }

  drop(event: CdkDragDrop<Tache[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      let tache = event.container.data[event.currentIndex];
      this.listeN.forEach(liste => {

        if (liste._id == event.container.id) {
          tache.statut = liste.titre;
          this.tacheService.updateTaches(tache).subscribe({
            next: (data) => {
            }
          });
          if (tache._id) {
            liste.taches.push(tache._id);
          }
          this.tacheService.updateListes(liste).subscribe({
            next: (data2: liste) => {
              //actualiser la liste
              this.tacheService.getListes(this.user).subscribe({
                next: (data3: Array<liste>) => { this.listeN = data3; }
              });
            }
          });
        }
        if (liste._id == event.previousContainer.id) {
          liste.tachesliste = liste.tachesliste.filter(t => t._id != tache._id);
          liste.taches = liste.taches.filter(t => t != tache._id);
          this.tacheService.updateListes(liste).subscribe({
            next: (data2: liste) => {
              //actualiser la liste
              this.tacheService.getListes(this.user).subscribe({
                next: (data3: Array<liste>) => { this.listeN = data3; }
              });
            }
          });
        }
      });
    }
  }
}
