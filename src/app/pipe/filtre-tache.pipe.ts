import { Pipe, PipeTransform } from '@angular/core';
import { Tache } from '../model/tache';

@Pipe({
  name: 'filtreTache'
})
export class FiltreTachePipe implements PipeTransform {

  transform(value: Array<Tache>, filter:string): Array<Tache> {
    if (!value) {
      return value;
    }
    switch(filter) {
      case 'En attente':
        return value.filter( tache => tache.statut === 'En attente')
        break;
      case 'En cours':
        return value.filter( tache => tache.statut === 'En cours')
        break;
      case 'Termine':
        return value.filter( tache => tache.statut === 'Termine')
        break;
        case 'Undefini':
        return value.filter( tache => tache.statut !== 'En attente' && tache.statut !== 'En cours' && tache.statut !== 'Termine');
        break;
      default:
        return value;

    }
  }

}
