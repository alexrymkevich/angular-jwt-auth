import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LocalStorageService  {
  public save(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public get(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  public delete(key: string) {
    localStorage.removeItem(key);
  }

  public clear() {
    localStorage.clear();
  }
}
