import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { Leaders } from '../shared/leaders';
import { resolve } from 'url';


@Injectable({
  providedIn: 'root'
})
export class LeaderService {
  getLeaders(): Promise<Leader[]> {
    return new Promise(
      resolve => {
        setTimeout(() => resolve(Leaders),2000);
      });
  }
  
  getLeader(id: string): Promise<Leader> {
    return new Promise(resolve => {
      setTimeout(() => resolve(Leaders.filter((leader) => (leader.id === id))[0]),2000);
    });
      
  }
  
  getFeaturedLeader(): Promise<Leader> {
    return new Promise(resolve => {
    setTimeout(() => resolve(Leaders.filter((leader) => leader.featured)[0]),2000);
    });
  }
  

  constructor() { }
}
