import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { ITransaction } from '../model/transaction.model';
import { environment } from '../../../../environements/environement';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private httpClient = inject(HttpClient);
  private _lastTransaction = signal<ITransaction | null>(null);
  lastTransaction = this._lastTransaction.asReadonly();

  makeTransaction(transaction: ITransaction) {
    const url = `${
      environment.backendUrl || 'http://localhost:3000'
    }/transactions`;

    return this.httpClient.post<ITransaction>(url, transaction).pipe(
      tap((tx) => this._lastTransaction.set(tx)),
      catchError((error) =>
        throwError(() => new Error('Something went wrong during checkout'))
      )
    );
  }
}
